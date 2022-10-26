chrome.storage.local.get(["content"], function (result) {
    const t = new URL(window.location.href).searchParams.get("t");
    const n = result.content.length - 1 - t;
    let text = result.content[n][1];
    let url_link = result.content[n][2];
    let title = result.content[n][3];
    const $body = document.getElementsByTagName("body")[0];
    
    function self_chk () {
        let pattern_check = new RegExp(chrome.runtime.id, "g");
        return pattern_check.test(url_link);
    };
    if (text === null && self_chk()) {
        text = "";
    } else if (text === null && !self_chk()) {
        text = title;
    }
    let str = '<div class="ta-div"><textarea class="text-area-style">' + text + '</textarea><span class="r-date">' + result.content[n][0] + '</span><a title="ダブルクリックで削除" class="round-btn-delete"></a></div>';
    $body.insertAdjacentHTML("beforeend", str);
    const $textarea = document.getElementsByTagName("textarea")[0];
    const $button = document.getElementsByTagName("a")[0];
    $textarea.addEventListener("input", () => {
        result.content[n][1] = $textarea.value;
        chrome.storage.local.set(result);
    });
    $button.addEventListener("dblclick", () => {
        result.content[n][1] = $textarea.value;
        result.content.splice(n, 1);
        chrome.storage.local.set(result);
        window.close(location.href);
    });
});