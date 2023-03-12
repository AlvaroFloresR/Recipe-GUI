import * as model from "./model.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import paginationView from "./views/paginationView.js";
import resultsView from "./views/resultsView.js";
import bookmarksView from "./views/bookmarksView.js";
import addRecipeView from "./views/addRecipeView.js";

import { MODAL_CLOSE_SEC } from "./config.js";

import "core-js/stable";
import "regenerator-runtime/runtime";

// ----------------------------------------------------------------
//                        Get API Socket
// ----------------------------------------------------------------

const controlRecipe = async function () {
  try {
    // ? Not sure if should be removed
    console.clear();

    // Get Hash
    const hashValue = window.location.hash.slice(1);

    if (!hashValue) return;
    // Load Spinner
    recipeView.renderSpinner();

    // Load Recipe
    await model.loadRecipe(hashValue);

    // Rendering recipe
    recipeView.render(model.state.recipe);

    // Update Results View
    resultsView.update(model.getSearchResultsPage());

    // Render Bookmarks
    bookmarksView.update(model.state.bookmarks);
  } catch (err) {
    console.error(`Controller Issue -> ${err}`);
    recipeView.renderError(`Controller Issue -> ${err}`);
  }
};

const controlSearchResults = async function () {
  try {
    // Load Spinner
    resultsView.renderSpinner();

    // Get search query from view
    const searchQuery = searchView.getSearchQuery();

    if (!searchQuery) return;

    // Load search results
    await model.loadSearchResults(searchQuery.toString());

    // Rendering Results on Sidebar
    resultsView.render(model.getSearchResultsPage());

    // Rendering pagination
    paginationView.render(model.state.search);
  } catch (err) {
    recipeView.renderError(`Search Issue -> ${err}`);
  }
};

const controlPageChange = function (destPage) {
  // Rendering Results on Sidebar
  resultsView.render(model.getSearchResultsPage(destPage));

  // Rendering pagination
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update Servings
  model.updateServings(newServings);
  // Rendering recipe
  recipeView.update(model.state.recipe);
};

const controlToggleBookmark = function () {
  // Delete Bookmark depending on the status
  model.state.recipe.bookmarked
    ? model.deleteBookmark(model.state.recipe.id)
    : model.addBookmark(model.state.recipe);

  // Update Recipe View
  recipeView.update(model.state.recipe);

  // Render Bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Load Spinner
    addRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);

    // Render Added Recipe
    recipeView.render(model.state.recipe);

    // Show succes message
    addRecipeView.renderMessage();

    // Close Form
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);

    // Change ID in URL
    window.history.pushState(null, "", `#${model.state.recipe.id}`);

    // Render Bookmarks
    bookmarksView.render(model.state.bookmarks);
  } catch (err) {
    console.log(addRecipeView.renderError(err.message));
  }
  // console.log(newRecipe);
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHanlderRender(controlRecipe);
  recipeView.addHandlerServings(controlServings);
  recipeView.addHandlerBookmark(controlToggleBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerPageChange(controlPageChange);

  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
