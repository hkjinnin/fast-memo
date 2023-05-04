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

const active_contextmenu = async () => {
    await chrome.contextMenus.removeAll();
    chrome.contextMenus.create({
        type: "normal",
        id: "memo",
        title: "メモ",
        contexts: ["selection", "page"],
    });
};

chrome.runtime.onInstalled.addListener(active_contextmenu);
chrome.runtime.onStartup.addListener(active_contextmenu);
chrome.contextMenus.onClicked.addListener(function (info, tab) {
    switch (info.menuItemId) {
        case "memo":
            const now = now_date();
            const text = info.selectionText;
            const url_link = tab.url;
            const title = tab.title;
            const content = [now, text, url_link, title];
            chrome.storage.local.get(["content"], function (result) {
                result.content = result.content || [];
                result.content.push(content);
                chrome.storage.local.set(result);
                try {
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
