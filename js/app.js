const $text_area = document.getElementsByTagName("textarea");
const $delete_btn = document.getElementsByClassName("round-btn-delete");
const $url_btn = document.getElementsByClassName("round-btn-url");
const $first = document.getElementById("first");
const $ta_div = document.getElementsByClassName("ta-div");

chrome.runtime.onMessage.addListener(function (request) {
    if (request.trigger == "memo") {
        location.reload();
    }
});
chrome.storage.local.get(["content"], function (result) {
    const Observer = new ResizeObserver((entries) => {
        let n = [].slice.call($text_area).indexOf(entries[0].target);
        $first.style.width = entries[0].target.clientWidth + "px";
        console.log(entries[0].target.clientWidth);
    });
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
            
        }
    }
    function s_c(i, n) {
        let str = '<div class="ta-div"><textarea>' + result.content[i][n] + '</textarea><span class="r-date">' + result.content[i][0] + '</span><a title="' + result.content[i][3] + '" class="round-btn-url"><i></i></a><a title="ダブルクリックで削除" class="round-btn-delete"></a></div>';
        return str;
    }
    try {
        if (result.content.length == 0) {
            throw "No Element";
        }
        for (let i = result.content.length - 1; i >= 0; i--) {
            if (result.content[i][1] == null) {
                $first.insertAdjacentHTML("beforeend", s_c(i, 3));
            } else {
                $first.insertAdjacentHTML("beforeend", s_c(i, 1));
            }
        }
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
        Array.prototype.forEach.call($text_area, function (ta) {
            Observer.observe(ta);
        });
    } catch (e) {
        $first.insertAdjacentHTML("beforeend", '<div style="text-align: center;"><h1>まだ何もメモしていません<br>右クリックメニューでメモできます</h1></div>');
    }
});
