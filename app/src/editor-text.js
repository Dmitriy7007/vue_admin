module.exports = class EditorText {
  constructor(el, virtualEl) {
    this.el = el;
    this.virtualEl = virtualEl;

    this.el.addEventListener("click", () => this.onClick());
    this.el.addEventListener("blur", () => this.onBlur());
    this.el.addEventListener("keypress", (e) => this.onKeypress(e));
    this.el.addEventListener("input", () => this.onTextEdit());
  }

  onClick() {
    this.el.contentEditable = "true";
    this.el.focus();
  }

  onBlur() {
    this.el.removeAttribute("contenteditable");
  }

  onKeypress(e) {
    if (e.keyCode === 13) {
      this.el.blur();
    }
  }

  onTextEdit() {
    this.virtualEl.innerHTML = this.el.innerHTML; // Запись в виртуальный DOM при изменении поля input
  }
};
