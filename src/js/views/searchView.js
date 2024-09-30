class SearchView {
  #searchInput = document.querySelector('.search__field');
  #searchBtn = document.querySelector('.search__btn');
  _parentElement = document.querySelector('.search');

  getQuery() {
    const query = this.#searchInput.value;
    this.#clearInput();
    return query;
  }

  #clearInput() {
    this.#searchInput.value = '';
  }

  addHandlerSearch(callback) {
    this.#searchBtn.addEventListener('click', callback);
    window.addEventListener('submit', function (e) {
      e.preventDefault();
      callback();
    });
  }
}

export default new SearchView();
