const $text_area = document.getElementsByTagName("textarea");
const $delete_btn = document.getElementsByClassName("round-btn-delete")
const $url_btn = document.getElementsByClassName("round-btn-url")
const $first = document.getElementById("first");

chrome.storage.local.get(['content'], function (result) {
    function c_change(n) {
        result.content[(result.content.length - 1) - n][1] = $text_area[n].value;
        chrome.storage.local.set(result);
    }
    function c_delete(n) {
        result.content.splice((result.content.length - 1) - n, 1);
        chrome.storage.local.set(result);
        location.reload();
    }
    function c_url(n) {
        window.open(result.content[(result.content.length - 1) - n][2])
    }
    try {
        if (result.content.length == 0) {
            throw 'No Element';
        };
        for (let i = result.content.length - 1; i >= 0; i--) {
            if (result.content[i][1] == null) {
                $first.insertAdjacentHTML('beforeend', '<div class="text-area-div"><textarea style="height:' + ((result.content[i][3].length * 0.6) + 60) + 'px;">' + result.content[i][3] + '</textarea><span class="r-date">' + result.content[i][0] + '</span><a title="' + result.content[i][3] + '" class="round-btn-url"><i></i></a><a title="ダブルクリックで削除" class="round-btn-delete"></a></div>');
            }else {
                $first.insertAdjacentHTML('beforeend', '<div class="text-area-div"><textarea style="height:' + ((result.content[i][1].length * 0.6) + 60) + 'px;">' + result.content[i][1] + '</textarea><span class="r-date">' + result.content[i][0] + '</span><a title="' + result.content[i][3] + '" class="round-btn-url"><i></i></a><a title="ダブルクリックで削除" class="round-btn-delete"></a></div>');
            }
        };
        Array.from($text_area, e => {
            e.addEventListener("input", e => {
                c_change(Array.prototype.indexOf.call($text_area, e.target));
            });
        });
        Array.from($delete_btn, e => {
            e.addEventListener("dblclick", e => {
                c_delete(Array.prototype.indexOf.call($delete_btn, e.target));
            });
        });
        Array.from($url_btn, e => {
            e.addEventListener("click", e => {
                c_url(Array.prototype.indexOf.call($url_btn, e.target));
            });
        });
    } catch (e) {
        $first.insertAdjacentHTML('beforeend', '<div style="text-align: center;"><h1>まだ何もメモしていません<br>右クリックメニューでメモできます</h1></div>');
    };
});


