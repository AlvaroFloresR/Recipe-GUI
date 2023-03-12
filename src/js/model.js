import { API_URL, RES_PER_PAGE, API_KEY } from "./config.js";
import { AJAX } from "./helper.js";

export const state = {
  recipe: {},
  search: {
    searchQuery: "",
    searchResults: [],
    pageNumber: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = function (responseJSON) {
  // Store Data
  let { recipe: recipeTmp } = responseJSON.data;

  // Get Only specific values
  return {
    id: recipeTmp.id,
    title: recipeTmp.title,
    publisher: recipeTmp.publisher,
    sourceUrl: recipeTmp.source_url,
    image: recipeTmp.image_url,
    servings: recipeTmp.servings,
    cookingTime: recipeTmp.cooking_time,
    ingredients: recipeTmp.ingredients,
    ...(recipeTmp.key && { key: recipeTmp.key }),
  };
};

export const loadRecipe = async function (hashValue) {
  try {
    // Get JSON
    const responseJSON = await AJAX(`${API_URL}${hashValue}?key=${API_KEY}`);

    state.recipe = createRecipeObject(responseJSON);

    if (state.bookmarks.some((bkmrk) => bkmrk.id === hashValue))
      state.recipe.bookmarked = true;

    return state;
  } catch (err) {
    throw `⚙️ Model Load Issue -> ${err}`;
  }
};

export const loadSearchResults = async function (searchQuery) {
  try {
    // Reset Pagination
    state.search.pageNumber = 1;
    // Store Query
    state.search.searchQuery = searchQuery;

    // Get Search Results
    const searchJSON = await AJAX(
      `${API_URL}?search=${searchQuery}&key=${API_KEY}`
    );

    // Store searched recipes
    state.search.searchResults = searchJSON.data.recipes.map((singleRecipe) => {
      return {
        id: singleRecipe.id,
        title: singleRecipe.title,
        publisher: singleRecipe.publisher,
        image: singleRecipe.image_url,
        ...(singleRecipe.key && { key: singleRecipe.key }),
      };
    });
  } catch (err) {
    throw `⚙️ Model Search Issue -> ${err}`;
  }
};

export const getSearchResultsPage = function (page = state.search.pageNumber) {
  // Change state of page number
  state.search.pageNumber = page;

  // Get slice of results
  const start = (page - 1) * RES_PER_PAGE;
  const end = page * RES_PER_PAGE;

  return state.search.searchResults.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach((indIng) => {
    indIng.quantity = (indIng.quantity / state.recipe.servings) * newServings;
  });

  state.recipe.servings = newServings;
};

const storeBookmarks = function () {
  localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  // Add Bookmark
  state.bookmarks.push(recipe);

  // Mark current recipe as bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  // Store in local storage
  storeBookmarks();
};

export const deleteBookmark = function (id) {
  // Get Index
  const index = state.bookmarks.findIndex((ele) => ele.id === id);

  // Delete Bookmark
  state.bookmarks.splice(index, 1);

  // Mark current recipe as bookmark
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  // Store in local storage
  storeBookmarks();
};

const init = function () {
  const storage = localStorage.getItem("bookmarks");

  if (storage) state.bookmarks = JSON.parse(storage);
};

init();

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter((entry) => entry[0].includes("ingredient") && entry[1] !== "")
      .map((ing) => {
        const ingArr = ing[1].split(",").map((ele) => ele.trim());

        if (ingArr.length !== 3) throw new Error("Wrong Ingredient Format");

        const [quantity, unit, description] = ingArr;
        return {
          quantity: quantity ? Number(quantity) : null,
          unit,
          description,
        };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: Number(newRecipe.cookingTime),
      servings: Number(newRecipe.servings),
      ingredients,
    };

    // Send recipe to API

    const dataReturnedAPI = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);

    // Give format to results
    state.recipe = createRecipeObject(dataReturnedAPI);

    // // Add default bookmark
    addBookmark(state.recipe);

    console.log(state.recipe);
  } catch (err) {
    throw err;
  }
};
