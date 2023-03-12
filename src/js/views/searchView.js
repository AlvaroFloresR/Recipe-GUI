class SearchView {
  _parentElement = document.querySelector(".search");

  getSearchQuery() {
    const query = this._parentElement.querySelector(".search__field").value;
    this.#clearInput();
    return query;
  }

  #clearInput() {
    this._parentElement.querySelector(".search__field").value = "";
  }

  addHandlerSearch(handler) {
    // Listen for form submit
    this._parentElement.addEventListener("submit", function (e) {
      // Prevent page reloading
      e.preventDefault();

      // Call Load Results
      handler();
    });
  }
}

export default new SearchView();
