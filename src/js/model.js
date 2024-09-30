import { async } from 'regenerator-runtime';
import { API_URL } from './config';
import { API_KEY } from './config';
import { getJSON, sendJSON } from './helpers';
import { RESULTSPERPAGE } from './config';
export const state = {
  recipe: {},
  search: { query: '', results: [], page: 0 },
  bookmarks: [],
};

const createRecipeObject = function(data){
  // format api data for the application
  return {
    id: data.id,
    title: data.title,
    publisher: data.publisher,
    sourceUrl: data.source_url,
    image: data.image_url,
    servings: data.servings,
    cookingTime: data.cooking_time,
    ingredients: data.ingredients,
    ...(data.key && {key: data.key}),
  };
}

export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}${id}?key=${API_KEY}`);

    const { recipe } = data.data;

    state.recipe = createRecipeObject(recipe);
    if (state.bookmarks.some(bookmark => id === bookmark.id))
      state.recipe.bookmarked = true;
  } catch (err) {
    throw err;
  }
};

export const uploadRecipe = async function(newRecipe){
  // format ingredients
  const ingredients = Object.entries(newRecipe).filter(entry => entry[0].startsWith('ingredient') && !['',',,,', ',,', ','].includes(entry[1])).map(ing =>{
    const ingArr = ing[1].trim().split(',');
    if(ingArr.length !== 3) throw new Error('Wrong ingredient format! Please use the correct format :)');
    const [quantity, unit, description] = ingArr;
    return { quantity: quantity || null,
             unit:unit || null,
             description:description || null };
  });

  // build recipe object
  const recipe = {
    cooking_time: newRecipe.cookingTime,
    image_url:newRecipe.image,
    ingredients,
    publisher: newRecipe.publisher,
    servings: newRecipe.servings,
    source_url: newRecipe.sourceUrl,
    title: newRecipe.title,
  };

  // upload recipe object to api
  const data = await sendJSON(`${API_URL}?key=${API_KEY}`, recipe);

  // display uploaded recipe 
  const uploadedRecipe = createRecipeObject(data.data.recipe);
  state.recipe = uploadedRecipe;

  // bookmark uploaded recipe
  addBookmark(state.recipe);
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await getJSON(`${API_URL}?search=${query}&key=${API_KEY}`);
    this.state.search.results = data.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
        ...(recipe.key && {key: recipe.key}),
      };
    });
  } catch (err) {
    throw err;
  }
};
export const resetPage = function () {
  this.state.search.page = 1;
};

export const onFirstPage = function () {
  return state.search.page === 1;
};

export const onLastPage = function () {
  return state.search.page >= state.search.results.length / RESULTSPERPAGE;
};

export const decreaseResultsPage = function () {
  if (onFirstPage()) return;
  state.search.page--;
};

export const increaseResultsPage = function () {
  if (onLastPage()) return;
  state.search.page++;
};

export const getSearchResultsPage = function () {
  const page = state.search.page;
  const start = (page - 1) * RESULTSPERPAGE;
  const end = page * RESULTSPERPAGE;
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  if (newServings < 1) return;
  state.recipe.ingredients.forEach(ing => {
    if (!ing.quantity) return;
    ing.quantity = (ing.quantity / state.recipe.servings) * newServings;
  });
  state.recipe.servings = newServings;
};

export const addBookmark = function (recipe) {
  state.bookmarks.push(recipe);
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  _saveBookmarks();
};

export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex(b => b.id === id);
  if (index < 0) return;

  state.bookmarks.splice(index, 1);
  state.recipe.bookmarked = false;
  _saveBookmarks();
};

const _loadBookmarks = function () {
  const data = window.localStorage.getItem('bookmarks');
  if (!data) return;
  const recipes = JSON.parse(data);
  recipes.forEach(recipe => state.bookmarks.push(recipe));
};

const _saveBookmarks = function () {
  window.localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

const clearBookmarks = function () {
  window.localStorage.clear();
};

const init = function () {
  // load saved bookmarks
  _loadBookmarks();
};
init();