import icons from "url:../../img/icons.svg";

export default class View {
  _data;

  /**
   * Render the received object to the DOM
   * @param {Object | Object[]} data The data to be rendered(e.g. Recipe)
   * @param {boolean} [render = true] If False create markup string, instead of rendering to DOM
   * @returns {undefined | string} A markup string is returned if render = false
   * @this {Object} View Instance
   * @author AlvaroF
   * @todo Integrate MySQL
   */

  render(data, render = true) {
    // Check data validity
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this.#clearHTML();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  update(data) {
    this._data = data;

    const newMarkup = this._generateMarkup();

    // Convert markup to VirtualDOM (To compare)
    const newDom = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDom.querySelectorAll("*"));
    const currElements = Array.from(this._parentElement.querySelectorAll("*"));

    newElements.forEach((newEle, idx) => {
      const currEle = currElements[idx];

      // Update Channge Text
      if (
        !newEle.isEqualNode(currEle) &&
        newEle.firstChild?.nodeValue.trim() !== ""
      ) {
        currEle.textContent = newEle.textContent;
      }

      // Update Attributes
      if (!newEle.isEqualNode(currEle)) {
        Array.from(newEle.attributes).forEach((attr) =>
          currEle.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  #clearHTML() {
    this._parentElement.innerHTML = "";
  }

  renderSpinner() {
    const htmlTemplate = `
        <div class="spinner">
                <svg>
                  <use href="${icons}#icon-loader"></use>
                </svg>
              </div> 
              `;
    this.#clearHTML();
    this._parentElement.insertAdjacentHTML("afterbegin", htmlTemplate);
  }

  renderError(message = this._defaultErrorMsg) {
    const htmlTemplate = `<div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>`;
    this.#clearHTML();
    this._parentElement.insertAdjacentHTML("afterbegin", htmlTemplate);
  }

  renderMessage(message = this._defaultMsg) {
    const htmlTemplate = `<div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>`;
    this.#clearHTML();
    this._parentElement.insertAdjacentHTML("afterbegin", htmlTemplate);
  }
}
