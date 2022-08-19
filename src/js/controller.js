import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

//polyfilling for old browsers
import 'core-js/stable';
import 'regenerator-runtime/runtime';

// if(module.hot){
//   module.hot.accept();
// };

// https://forkify-api.herokuapp.com/v2
///////////////////////////////////////

const controlRecipes = async function(){
  try{
      
      const id = window.location.hash.slice(1);
  

      // Guard clause for no id
      if(!id) return ;
      recipeView.renderSpinner();

      //update results view to mark selected search result
      resultsView.update(model.getSearchResultsPage());
      bookmarksView.update(model.state.bookmarks);

        //API CALL

      await model.loadRecipe(id);  
     
      // const res = await fetch('https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bc886');     

       //Rendering recipe
       recipeView.render(model.state.recipe);     
      
       
  }catch(err){
    recipeView.renderError();
  };

};

const controlSearchResults = async function(){
    try{
      
      //get search query
      const query = searchView.getQuery();

      if(!query) return document.querySelector('.search__field').placeholder = 'Please enter a recipe';

      // spinner
      resultsView.renderSpinner();
      

      //load search results
       await model.loadSearchResults(query);


       //render results
      //  resultsView.render(model.state.search.results);
       resultsView.render(model.getSearchResultsPage());
    

       //render pagination buttons
       paginationView.render(model.state.search);
      
    }catch(err){
      throw(err);
    }
  };


  const controlPagination = function (goToPage){
    //render new results
    resultsView.render(model.getSearchResultsPage(goToPage));

     //render pagination new buttons
    paginationView.render(model.state.search);
   
  };

  //for updating servings quatity
  const controlServings = function(newServings){
      // update the recipe servings (in the state)
      model.updateServings(newServings);


      // updating the recipeView
      // recipeView.render(model.state.recipe);    

       // updating the recipeView with virtual DOM
       recipeView.update(model.state.recipe);

  };

  //Control for adding a new bookmark
  const controlAddBookmark = function(){
    // Condition to check if the recipe already been bookmarked or not. 
    // Add to bookmarks if not, delete if already bookmarked
    !model.state.recipe.bookmarked ? 
    model.addBookmark(model.state.recipe) : 
    model.deleteBookmark(model.state.recipe.id);

   

    //renders the new DOm with only the changed elements to update
    recipeView.update(model.state.recipe);

    //render bookmarks view
    bookmarksView.render(model.state.bookmarks);

  };   

  //Displaying bookmarks on load
  const controlDisplayBookmark = function(){
    bookmarksView.render(model.state.bookmarks);
  };

  //create control for addREcipe, will recive the recipe data
  const controlAddRecipe = async function (newRecipe){
    try{
      //show loading spinner
      addRecipeView.renderSpinner();

    //Upload a new recipe data
     await model.uploadRecipe(newRecipe);
  

     //render recipe
     recipeView.render(model.state.recipe);

     //render message
     addRecipeView.renderMessage();

     //render bookmarkView
     bookmarksView.render(model.state.bookmarks);

     //history API , change ID in the URL
     //three arguments but only the third is important
     //going back and forth as forward and back buttons
     //window.history.back();
     window.history.pushState(null,'', `#${model.state.recipe.id}`);

    

     //close form window
     setTimeout(function(){       
        addRecipeView.toggleWindow(); 
        //reload
        location.reload();         
     }, MODAL_CLOSE_SEC)

    }catch(err){
      addRecipeView.renderError(err.message)
    }
  };


//IIFE calling the method from the View to set up the render event.
//publisher and subscriber method: Subscriber
(function(){
bookmarksView.addBookmarkHandler(controlDisplayBookmark);
recipeView.addHandlerRender(controlRecipes);
recipeView.addhandlerUpdateServings(controlServings);
recipeView.addHandlerAddBookmark(controlAddBookmark);
searchView.addhandlerSearch(controlSearchResults);
paginationView.addHandlerClick(controlPagination);
addRecipeView.addHandlerUpload(controlAddRecipe);

})();
