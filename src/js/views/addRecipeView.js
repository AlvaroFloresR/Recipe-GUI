import View from "./view.js";
import icons from "url:../../img/icons.svg";

class addRecipeView extends View {
  // Private Fields
  _parentElement = document.querySelector(".upload");
  _defaultMsg = "Recipe was succesfully uploaded!";
  _window = document.querySelector(".add-recipe-window");
  _overlay = document.querySelector(".overlay");
  _btnOpen = document.querySelector(".nav__btn--add-recipe");
  _btnClose = document.querySelector(".btn--close-modal");

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerCloseWindow();
  }

  resetForm() {}
  resetFields() {}

  toggleWindow() {
    this._overlay.classList.toggle("hidden");
    this._window.classList.toggle("hidden");
  }

  _addHandlerShowWindow() {
    this._btnOpen.addEventListener("click", this.toggleWindow.bind(this));
  }

  _addHandlerCloseWindow() {
    this._btnClose.addEventListener("click", this.toggleWindow.bind(this));
    this._overlay.addEventListener("click", this.toggleWindow.bind(this));
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener("submit", function (e) {
      // Avoid moving to new windows
      e.preventDefault();

      // Get form data into an array
      const dataArray = [...new FormData(this)];
      const data = Object.fromEntries(dataArray);

      // Call handler with data
      handler(data);
    });
  }
}

export default new addRecipeView();
