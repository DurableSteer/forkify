import { MODAL_CLOSE_SEC } from './config.js'
import { MODAL_RESET_SEC } from './config.js'
import 'core-js/stable';
import 'regenerator-runtime';
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import pagingationView from './views/pagingationView.js';
import bookmarkView from './views/bookmarkView.js';
import addRecipeView from './views/addRecipeView.js'

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    //render spinner while loading
    recipeView.renderSpinner();

    //update results view to mark selection
    resultsView.update(model.getSearchResultsPage());
    //fetch recipe data
    await model.loadRecipe(id);
    //render recipe data
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError(err);
  }
};

const controlSearchResults = async function () {
  try {
    // get search query
    const query = searchView.getQuery();
    if (!query) return;
    //render spinner while loading
    resultsView.renderSpinner();
    //fetch recipe data
    await model.loadSearchResults(query);
    //render search results
    model.resetPage();
    updateResultsPage();
  } catch (err) {
    resultsView.renderError();
  }
};
const prevResultsPage = function () {
  model.decreaseResultsPage();
  updateResultsPage();
};

const nextResultsPage = function () {
  model.increaseResultsPage();
  updateResultsPage();
};

const updateResultsPage = function () {
  const data = {
    page: model.state.search.page,
    renderPrev: !model.onFirstPage(),
    renderNext: !model.onLastPage(),
  };
  pagingationView.render(data);
  resultsView.render(model.getSearchResultsPage());
};

const controlServings = function (offset) {
  //update servings in state
  const newServings = model.state.recipe.servings + offset;
  model.updateServings(newServings);

  //update the recipe view
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // add/remove bookmark
  if (model.state.recipe.bookmarked)
    model.deleteBookmark(model.state.recipe.id);
  else model.addBookmark(model.state.recipe);

  // update recipe view
  recipeView.update(model.state.recipe);

  // render bookmarks
  bookmarkView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarkView.render(model.state.bookmarks);
};

const closeAddRecipeView = function(){
  if (addRecipeView.isOpen()) addRecipeView.toggleWindow();
  setTimeout(addRecipeView.reset.bind(addRecipeView), MODAL_RESET_SEC*1000);
};

const controlAddRecipe = async function(newRecipe){
  try{
    addRecipeView.renderSpinner();
    await model.uploadRecipe(newRecipe);
    recipeView.render(model.state.recipe);
    bookmarkView.render(model.state.bookmarks);
    //window.location.hash = `#${model.state.recipe.id}`;
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    setTimeout(closeAddRecipeView, MODAL_CLOSE_SEC*1000);
    // display success message
    addRecipeView.renderMessage();

  }catch(err){
    addRecipeView.renderError(err);
  }
}

///////////////////////////////////////////////////////////////
// Event listeners
const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHanderUpdateServings(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  pagingationView.addHandlersPagination(nextResultsPage, prevResultsPage);
  bookmarkView.addHandlerLoaded(controlBookmarks);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();