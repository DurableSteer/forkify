import icons from '../../img/icons.svg';
import View from './view';
import { mark } from 'regenerator-runtime';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  _generateMarkup() {
    let markup = '';
    if (this._data.renderPrev) {
      markup += `
    <button class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${this._data.page - 1}</span>
    </button>`;
    }
    if (this._data.renderNext) {
      markup += `
    <button class="btn--inline pagination__btn--next">
            <span>Page ${this._data.page + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
    </button>`;
    }
    return markup;
  }

  addHandlersPagination(next, prev) {
    this._parentElement.addEventListener('click', function (e) {
      const closestBtn = e.target.closest('.btn--inline');
      if (!closestBtn) return;
      if (closestBtn.classList.contains('pagination__btn--prev')) prev();
      if (closestBtn.classList.contains('pagination__btn--next')) next();
    });
  }
}

export default new PaginationView();
