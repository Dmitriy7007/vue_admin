const axios = require("axios/dist/browser/axios.cjs");

const DOMHelper = require("./dom-helper");
const EditorText = require("./editor-text");

require("./iframe-load");

module.exports = class Editor {
  constructor() {
    this.iframe = document.querySelector("iframe");
  }

  open(page, cb) {
    this.currentPage = page;

    axios
      .get("../" + page + "?rnd=" + Math.random())
      .then((res) => DOMHelper.parseStrToDom(res.data)) // Создаем DOM-дерево, в котором сохраняем полученный в виде строки ответ от сервера, представляющий собой код оригинальной страницы html
      .then(DOMHelper.wrapTextNodes) // В созданном DOM-дереве создаем обертки для возможности редактирования текстовых полей
      .then((dom) => {
        this.virtualDom = dom;
        return dom;
      }) // Создаем еще один виртуальный DOM-дерево, которое будет хранить исходный код
      .then(DOMHelper.serializeDomToStr) // Превращаем DOM-дерево в строку
      .then((html) => axios.post("./api/saveTempPage.php", { html: html })) // Сохраняем этот код в файле temp.html
      .then(() => this.iframe.load("../temp.html")) // Используем библиотеку iframe-load, загружаем в iframe код из файла temp.html
      .then(() => this.enableEditing()) // Включаем contentEditable у тектовых эллементов
      .then(() => this.injectStyles()) // подключение стилей
      .then(cb);
  }

  enableEditing() {
    this.iframe.contentDocument.body
      .querySelectorAll("text-editor")
      .forEach((el) => {
        const id = el.getAttribute("nodeId");
        const virtualEl = this.virtualDom.body.querySelector(
          `[nodeId="${id}"]`
        );
        new EditorText(el, virtualEl);
      });
  }

  injectStyles() {
    const style = this.iframe.contentDocument.createElement("style");
    style.innerHTML = `
        text-editor:hover {
            outline: 3px solid orange;
            outline-offset: 8px;
        }
        text-editor:focus {
            outline: 3px solid red;
            outline-offset: 8px;
        }
    `;
    this.iframe.contentDocument.head.appendChild(style);
  }

  save(onSuccess, onError) {
    const newDom = this.virtualDom.cloneNode(this.virtualDom);
    DOMHelper.unwrapTextNodes(newDom);
    const html = DOMHelper.serializeDomToStr(newDom);
    axios
      .post("./api/savePage.php", { pageName: this.currentPage, html })
      .then(onSuccess)
      .catch(onError);
  }
};
