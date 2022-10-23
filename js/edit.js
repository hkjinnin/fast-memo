const $body = document.getElementsByTagName("body")[0];
const t = new URL(window.location.href).searchParams.get('t');

chrome.storage.local.get(["content"], function (result) {
    const n = result.content.length - 1 - t
    let str = '<div class="ta-div"><textarea class="area-size">' + result.content[n][1] + '</textarea><span class="r-date">' + result.content[n][0] + '</span><a title="ダブルクリックで削除" class="round-btn-delete"></a></div>';
    console.log(result.content[0])
    $body.insertAdjacentHTML("beforeend", str);
});