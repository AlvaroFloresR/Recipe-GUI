// Import Parent class
import View from "./view.js";
import previewView from "./previewView.js";

class resultsView extends View {
  // Private Fields
  _parentElement = document.querySelector(".results");
  _defaultErrorMsg = "Search didn't found anything 😞";
  _defaultMsg = "Nothing serached :D";

  _generateMarkup() {
    return this._data
      .map((result) => previewView.render(result, false))
      .join("");
  }
}

export default new resultsView();
