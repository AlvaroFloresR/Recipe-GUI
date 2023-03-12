import View from "./view.js";
import icons from "url:../../img/icons.svg";

class paginationView extends View {
  // Private Fields
  _parentElement = document.querySelector(".pagination");

  _generateMarkup() {
    const currentPage = this._data.pageNumber;
    const numPages = Math.ceil(
      this._data.searchResults.length / this._data.resultsPerPage
    );

    // Page 1 and other pages
    if (currentPage === 1 && numPages > 1) {
      return `
      <button data-goto="${
        currentPage + 1
      }" class="btn--inline pagination__btn--next">
            <span>Page ${currentPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>`;
    }
    // Page 1 and no other pages
    if (currentPage === 1 && numPages === 1) {
      return "";
    }
    // Last page
    if (currentPage === numPages) {
      return `
      <button data-goto="${
        currentPage - 1
      }" class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>Page ${currentPage - 1}</span>
    </button>
    `;
    }
    // Other page
    if (currentPage < numPages) {
      return `
      <button data-goto="${
        currentPage - 1
      }" class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>Page ${currentPage - 1}</span>
    </button>

    <button data-goto="${
      currentPage + 1
    }" class="btn--inline pagination__btn--next">
            <span>Page ${currentPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
    `;
    }
  }

  addHandlerPageChange(handler) {
    // Listen for form submit
    this._parentElement.addEventListener("click", function (e) {
      // Prevent page reloading
      e.preventDefault();

      // Call Load Results
      const btn = e.target.closest(".btn--inline");
      if (!btn) return;

      handler(Number(btn.dataset.goto));
    });
  }
}

export default new paginationView();
