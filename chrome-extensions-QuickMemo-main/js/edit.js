// データ取得
chrome.storage.local.get(["content"], function (result) {
    // URLパラメータから対象のインデックスを取得
    const index = new URL(window.location.href).searchParams.get("t");
    
    // 必要なデータを取得
    let text = result.content[index][1];
    let urlLink = result.content[index][2];
    let title = result.content[index][3];
    const body = document.getElementsByTagName("body")[0];

    // 自身のURLかどうかを確認
    function isSelf() {
        let patternCheck = new RegExp(chrome.runtime.id, "g");
        return patternCheck.test(urlLink);
    }

    // テキストデータの設定
    if (text === null && isSelf()) {
        text = "";
    } else if (text === null && !isSelf()) {
        text = title;
    }

    // 新たなエレメントを作成する関数
    function createElementWithClass(elementType, className) {
        const element = document.createElement(elementType);
        element.classList.add(className);
        return element;
    }

    // HTMLエレメントの作成と追加
    const taDiv = createElementWithClass("div", "ta-div");
    const textarea = createElementWithClass("textarea", "text-area-style");
    textarea.value = text;
    taDiv.appendChild(textarea);
    const rDate = createElementWithClass("span", "r-date");
    rDate.textContent = result.content[index][0];
    taDiv.appendChild(rDate);
    const button = createElementWithClass("a", "round-btn-delete");
    button.title = "ダブルクリックで削除";
    taDiv.appendChild(button);
    body.appendChild(taDiv);

    // テキストエリアの変更を監視
    textarea.addEventListener("input", () => {
        result.content[index][1] = textarea.value;
        chrome.storage.local.set(result);
    });

    // ダブルクリックでデータ削除
    button.addEventListener("dblclick", () => {
        result.content[index][1] = textarea.value;
        result.content.splice(index, 1);
        chrome.storage.local.set(result);
        window.close(location.href);
    });
});
