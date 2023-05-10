class Memo {
    constructor(n, content) {
        this.n = n;
        this.date = content[n][0];
        this.text = this.escapeHtml(content[n][1]);
        this.url_link = content[n][2];
        this.title = this.escapeHtml(content[n][3]);
    }
    escapeHtml(target) {
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

    self_chk() {
        let pattern_check = new RegExp(chrome.runtime.id, "g");
        return pattern_check.test(this.url_link);
    }

    switch_btn() {
        if (this.type_chk() === "memo") {
            return '<a style="right: 55px" class="round-btn-edit"></a>';
        }
        return '<a title="memo画面で編集" class="round-btn-edit"></a><a title="' + this.title + '" class="round-btn-url"></a>';
    }

    type_chk() {
        if (this.self_chk()) {
            return "memo";
        } else if (this.text === null) {
            return "url";
        } else if (!(this.text === null)) {
            return "text";
        }
    }

    switch_text() {
        switch (this.type_chk()) {
            case "memo":
                if (this.text == null) {
                    return "";
                }
                return this.text;
            case "url":
                return this.title;
            case "text":
                return this.text;
        }
    }

    ta_height() {
        const font_size = 16;
        const height = (this.switch_text().length * (font_size / 15)) + 10;
        return height;
    }

    content() {
        return '<div class="ta-div"><textarea class="textarea-style" style="height:' + this.ta_height() + 'px">' + this.switch_text() + '</textarea><span class="r-date">' + this.date + '</span>' + this.switch_btn() + '<a title="ダブルクリックで削除" class="round-btn-delete"></a></div>';
    }
}
function e_add(n, req, result) {
    switch (req) {
        case "s":
            result.content[result.content.length - 1 - n][1] = document.getElementsByTagName("textarea")[n].value;
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
            url.searchParams.append('t', n);
            window.open(url);
            break;
    }
}
function addEventListenerByClass(className, event, handler) {
    const elements = document.getElementsByClassName(className);
    Array.from(elements, (e) => {
        e.addEventListener(event, handler);
    });
}

chrome.runtime.onMessage.addListener(function (request) {
    if (request.trigger == "memo") {
        location.reload();
    }
});

chrome.storage.local.get(["content"], function (result) {
    const $main = document.getElementById("main");
    try {
        if (result.content.length === 0) {
            throw "No Element";
        }
        for (let i = result.content.length - 1; i >= 0; i--) {
            let memo = new Memo(i, result.content);
            $main.insertAdjacentHTML("beforeend", memo.content());
        }

        const handleEvent = (e, elements, action) => {
            const index = Array.prototype.indexOf.call(elements, e.target);
            e_add(index, action, result);
        };

        addEventListenerByClass("textarea-style", "input", (e) => {
            handleEvent(e, document.getElementsByTagName("textarea"), "s", result);
        });

        addEventListenerByClass("round-btn-delete", "dblclick", (e) => {
            handleEvent(e, document.getElementsByClassName("round-btn-delete"), "d", result);
        });

        addEventListenerByClass("round-btn-url", "click", (e) => {
            handleEvent(e, document.getElementsByClassName("round-btn-url"), "u", result);
        });

        addEventListenerByClass("round-btn-edit", "click", (e) => {
            handleEvent(e, document.getElementsByClassName("round-btn-edit"), "e", result);
        });

    } catch (e) {
        if (e === "No Element") {
            $main.insertAdjacentHTML("beforeend", '<div class="memo-div"></div>');
        } else {
            console.log(e);
        }
    }
});
