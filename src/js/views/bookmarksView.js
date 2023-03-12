// Import Parent class
import View from "./view.js";
import previewView from "./previewView.js";

class bookmarksView extends View {
  // Private Fields
  _parentElement = document.querySelector(".bookmarks__list");
  _defaultErrorMsg = "No bookmakrs yet 😞";
  _defaultMsg = "Add a new bookmark ;)";

  addHandlerRender(handler) {
    window.addEventListener("load", handler);
  }

  _generateMarkup() {
    return this._data
      .map((bookmark) => previewView.render(bookmark, false))
      .join("");
  }
}

export default new bookmarksView();
