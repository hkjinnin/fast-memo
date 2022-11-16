chrome.runtime.onMessage.addListener(function (request) {
    if (request.trigger == "memo") {
        location.reload();
    }
});
chrome.storage.local.get(["content"], function (result) {
    const $main = document.getElementById("main");
    const $taresize = document.getElementsByClassName("taresize-btn");
    const $text_area = document.getElementsByTagName("textarea");
    const $delete_btn = document.getElementsByClassName("round-btn-delete");
    const $url_btn = document.getElementsByClassName("round-btn-url");
    const $edit_btn = document.getElementsByClassName("round-btn-edit");

    function e_add(n, req) {
        switch (req) {
            case "s":
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
                const url = new URL("./edit.html", "chrome-extension://" + chrome.runtime.id + "/");
                url.searchParams.append('t', n)
                window.open(url);
                break;
        }
    }
    function escapeHtml(target) {
        if (typeof target !== "string") {
            return target;
        }
        return target.replace(/[&'`"<>]/g, (match) => {
            return {
                "&": "&amp;",
                "'": "&#x27;",
                "`": "&#x60;",
                '"': "&quot;",
                "<": "&lt;",
                ">": "&gt;",
            }[match];
        });
    }
    var Show = function (_n) {
        let n = _n;
        let date = result.content[n][0];
        let text = escapeHtml(result.content[n][1]);
        let url_link = result.content[n][2];
        let title = escapeHtml(result.content[n][3]);
        var self_chk = function () {
            let pattern_check = new RegExp(chrome.runtime.id, "g");
            return pattern_check.test(url_link);
        };
        var switch_btn = function () {
            if (type_chk() == "memo") {
                return '<a style="right: 55px" class="round-btn-edit"></a>';
            }
            return '<a title="memo画面で編集" class="round-btn-edit"></a><a title="' + title + '" class="round-btn-url"></a>';
        };
        var type_chk = function () {
            if (self_chk()) {
                return "memo";
            } else if (text === null) {
                return "url";
            } else if (!(text === null)) {
                return "text"
            }
        };
        var switch_text = function () {
            switch (type_chk()) {
                case "memo":
                    if (text == null) {
                        return "";
                    }
                    return text
                case "url":
                    return title;
                case "text":
                    return text;
            }
        };
        var ta_height = function () {
            font_size = 16
            const height = (switch_text().length * (font_size / 15)) + 10;
            return height;
        };
        this.content = function () {
            return '<div class="ta-div"><textarea class="textarea-style" style="height:' + ta_height() + 'px">' + switch_text() + '</textarea><span class="r-date">' + date + '</span>' + switch_btn() + '<a title="ダブルクリックで削除" class="round-btn-delete"></a></div>';
        };
    };
    try {
        if (result.content.length == 0) {
            throw "No Element";
        }
        for (let i = result.content.length - 1; i >= 0; i--) {
            let show = new Show(i);
            $main.insertAdjacentHTML("beforeend", show.content());
        }
        $main.insertAdjacentHTML("afterbegin", '<div class="memo-div">右クリックメニューでメモできます</div>');
        Array.from($text_area, (e) => {
            e.addEventListener("input", (e) => {
                e_add(Array.prototype.indexOf.call($text_area, e.target), "s");
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
        console.log(e);
        $main.insertAdjacentHTML("beforeend", '<div class="memo-div">右クリックメニューでメモできます</div>');
    }
});
