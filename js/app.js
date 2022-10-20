const $text_area = document.getElementsByTagName("textarea");
const $delete_btn = document.getElementsByClassName("round-btn-delete");
const $url_btn = document.getElementsByClassName("round-btn-url");
const $first = document.getElementById("first");

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
        }
    }
    function t_style() {
        $text_area[n].style.height = $text_area[n].value.length + "rem";
    }
    function s_c(i, n) {
        let str = '<div class="text-area-div"><textarea>' + result.content[i][n] + '</textarea><span class="r-date">' + result.content[i][0] + '</span><a title="' + result.content[i][3] + '" class="round-btn-url"><i></i></a><a title="ダブルクリックで削除" class="round-btn-delete"></a></div>';
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
                t_style();
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
    } catch (e) {
        $first.insertAdjacentHTML("beforeend", '<div style="text-align: center;"><h1>まだ何もメモしていません<br>右クリックメニューでメモできます</h1></div>');
    }
});
