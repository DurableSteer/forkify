import View from './view';
import previewView from './previewView';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errMessage = 'No recipes found for your query! Please try again ;)';
  _selectedPreview;

  _generateMarkup() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
  // _generateMarkup() {
  //   const hash = window.location.hash.slice(1);
  //   return this._data
  //     .map(
  //       recipe => `
  //   <li class="preview">
  //           <a class="preview__link ${
  //             recipe.id === hash ? 'preview__link--active' : ''
  //           }" href="#${recipe.id}">
  //             <figure class="preview__fig">
  //               <img src="${recipe.image}" alt="Test" />
  //             </figure>
  //             <div class="preview__data">
  //               <h4 class="preview__title">${recipe.title}</h4>
  //               <p class="preview__publisher">${recipe.publisher}</p>
  //               <div class="preview__user-generated">
  //                 <svg>
  //                   <use href="${icons}#icon-user"></use>
  //                 </svg>
  //               </div>
  //             </div>
  //           </a>
  //   </li>`
  //     )
  //     .join('');
  // }
}
export default new ResultsView();
