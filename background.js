const now_date = () => {
    let now = new Date();
    n_d = now.getFullYear() + "/" + (now.getMonth() + 1) + "/" + now.getDate() + " : " + now.getHours() + "時" + now.getMinutes() + "分" + now.getSeconds() + "秒"
    return n_d
}
const active_contextmenu = async () => {
    await chrome.contextMenus.removeAll();
    chrome.contextMenus.create({
        type: 'normal',
        id: "memo",
        title: 'メモ',
        contexts: ['selection','page']
    });
};

chrome.runtime.onInstalled.addListener(active_contextmenu);
chrome.runtime.onStartup.addListener(active_contextmenu);
chrome.contextMenus.onClicked.addListener(function (info, tab) {
    if (info.menuItemId == "memo") {
        now = now_date();
        text = info.selectionText
        url_link = tab.url;
        title = tab.title;
        content = [now, text, url_link, title];
        chrome.storage.local.get(function (result) {
            result["content"] = result["content"] || [];
            result["content"].push(content);
            chrome.storage.local.set(result);
        });
    };
});
