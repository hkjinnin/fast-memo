chrome.storage.local.get(["content"], function (result) {
    const t = new URL(window.location.href).searchParams.get("t");
    const index = result.content.length - 1 - t;
    let text = result.content[index][1];
    let urlLink = result.content[index][2];
    let title = result.content[index][3];
    const body = document.getElementsByTagName("body")[0];

    function isSelf() {
        let patternCheck = new RegExp(chrome.runtime.id, "g");
        return patternCheck.test(urlLink);
    }

    if (text === null && isSelf()) {
        text = "";
    } else if (text === null && !isSelf()) {
        text = title;
    }

    function createElementWithClass(elementType, className) {
        const element = document.createElement(elementType);
        element.classList.add(className);
        return element;
    }

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

    textarea.addEventListener("input", () => {
        result.content[index][1] = textarea.value;
        chrome.storage.local.set(result);
    });

    button.addEventListener("dblclick", () => {
        result.content[index][1] = textarea.value;
        result.content.splice(index, 1);
        chrome.storage.local.set(result);
        window.close(location.href);
    });
});