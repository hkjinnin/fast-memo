const $text_area = document.getElementsByTagName("textarea");
const $body = document.getElementsByTagName("body")[0];

const $delete_btn = document.getElementsByClassName("round-btn-delete");
const $url_btn = document.getElementsByClassName("round-btn-url");
const $edit_btn = document.getElementsByClassName("round-btn-edit");

const $ta_div = document.getElementsByClassName("ta-div");

chrome.runtime.onMessage.addListener(function (request) {
    if (request.trigger == "memo") {
        location.reload();
    }
});
chrome.storage.local.get(["content"], function (result) {
    function e_add(n, req) {
        switch (req) {
            case "c":
                result.content[result.content.length - 1 - n][1] = $text_area[n].value;
                chrome.storage.local.set(result);
                break;
            case "d":
                result.content.splice(result.content.length - 1 - n, 1);
                chrome.storage.local.set(result);
                location.reload();
                break;
            case "u":
                window.open(result.content[result.content.length - 1 - n][2]);
                break;
            case "e":
                window.open("../edit.html?t=" + n);
                break;
        }
    }
    function s_c(i, n) {
        let textarea_resize = '"height:' + (result.content[i][n].length + 60) + 'px"';
        let j = result.content[i][3];
        if (n == 3) {
            j = ""
        }
        let str = '<div class="ta-div"><textarea style=' + textarea_resize + '>' + result.content[i][n] + '</textarea><span class="r-date">' + result.content[i][0] + '</span><a class="round-btn-edit"></a><a title="URL" class="round-btn-url"></a><a title="ダブルクリックで削除" class="round-btn-delete"></a></div>';
        return str;
    }
    try {
        if (result.content.length == 0) {
            throw "No Element";
        }
        for (let i = result.content.length - 1; i >= 0; i--) {
            if (result.content[i][1] == null) {
                $body.insertAdjacentHTML("beforeend", s_c(i, 3));
            } else {
                $body.insertAdjacentHTML("beforeend", s_c(i, 1));
            }
        }
        $body.insertAdjacentHTML("beforeend", '<div class="last-div"></div>');
        Array.from($text_area, (e) => {
            e.addEventListener("input", (e) => {
                e_add(Array.prototype.indexOf.call($text_area, e.target), "c");
            });
        });
        Array.from($delete_btn, (e) => {
            e.addEventListener("dblclick", (e) => {
                e_add(Array.prototype.indexOf.call($delete_btn, e.target), "d");
            });
        });
        Array.from($url_btn, (e) => {
            e.addEventListener("click", (e) => {
                e_add(Array.prototype.indexOf.call($url_btn, e.target), "u");
            });
        });
        Array.from($edit_btn, (e) => {
            e.addEventListener("click", (e) => {
                e_add(Array.prototype.indexOf.call($edit_btn, e.target), "e");
            });
        });
    } catch (e) {
        $body.insertAdjacentHTML("beforeend", '<div style="text-align: center;"><h1>まだ何もメモしていません<br>右クリックメニューでメモできます</h1></div>');
    }
});
