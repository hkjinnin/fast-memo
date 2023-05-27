// 現在の日時を取得しフォーマットする関数
const now_date = () => {
    const now = new Date();
    const options = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
    };
    return new Intl.DateTimeFormat("ja-JP", options).format(now);
};

// コンテキストメニューを設定する関数
const active_contextmenu = async () => {
    await chrome.contextMenus.removeAll();
    chrome.contextMenus.create({
        type: "normal",
        id: "memo",
        title: "メモ",
        contexts: ["selection", "page"],
    });
};

// 拡張機能がインストールまたは更新された際にコンテキストメニューを設定
chrome.runtime.onInstalled.addListener(active_contextmenu);
// ブラウザが起動した際にコンテキストメニューを設定
chrome.runtime.onStartup.addListener(active_contextmenu);

// コンテキストメニューがクリックされた時のイベントリスナー
chrome.contextMenus.onClicked.addListener(function (info, tab) {
    switch (info.menuItemId) {
        // "メモ"がクリックされた場合
        case "memo":
            const now = now_date();
            const text = info.selectionText;
            const url_link = tab.url;
            const title = tab.title;
            const content = [now, text, url_link, title];
            // メモをローカルストレージに保存
            chrome.storage.local.get(["content"], function (result) {
                result.content = result.content || [];
                result.content.push(content);
                chrome.storage.local.set(result);
                try {
                    // メモが保存されたことを他のパーツに通知
                    chrome.runtime.sendMessage({
                        trigger: "memo",
                    });
                } catch (error) {
                    console.log("not find reciver");
                }
            });
        break;
    }
});
