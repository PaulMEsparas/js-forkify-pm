import {API_URL, RES_PER_PAGE, API_KEY} from './config.js';
import {AJAX} from './helper.js';
 
 export const state ={
     recipe : {},
     search : {
         query:'',
         results: [],
         resultsPerPage : RES_PER_PAGE,
         page : 1,
     },
     bookmarks : []
 };

    const createRecipeObject = function(data){
        const{recipe} = data.data;
        return {
        id : recipe.id,
        title : recipe.title,
        image : recipe.image_url,
        publisher : recipe.publisher,
        sourceUrl : recipe.source_url,
        servings : recipe.servings,
        cookingTime : recipe.cooking_time,
        ingredients : recipe.ingredients,
        //conditional adding a key if there's any
        //using short circuitting
        //technique to conditionally add properties to an object
        ...(recipe.key && {key: recipe.key})
        };

    };
 export const loadRecipe = async function (id){
    try{    
        const data = await AJAX(`${API_URL}${id}?key=${API_KEY}`);

        state.recipe = createRecipeObject(data);

       
        if(state.bookmarks.some(bookmark => bookmark.id === id))
            state.recipe.bookmarked = true;
        else state.recipe.bookmarked = false;
        
        console.log(state.recipe);
    }catch(err){
        throw err;
    };
 };

 //Search results data
 export const loadSearchResults = async function(query){
    try{
        document.querySelector('.search__field').placeholder = 'Search over 1,000,000 recipes...';
        state.search.query = query;
        const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);
        console.log(data);
        state.search.results = data.data.recipes.map(rec => {
            return {
                id : rec.id,
                title : rec.title,
                image : rec.image_url,
                publisher : rec.publisher,  
                //technique to conditionally add properties to an object
                ...(rec.key && {key: rec.key})             
                };
             });   
        // resetting the page number for every search to always show page one
        state.search.page = 1; 

    }catch(err){
        throw err;
    };
 };

 //pagination

 export const getSearchResultsPage = function(page = state.search.page){

    state.search.page = page;
     // logic for displaying how many entries in a page ( start , end);
     const start = (page -1) * state.search.resultsPerPage;   //0;
     const end =   (page * state.search.resultsPerPage);  //9;
    
    return state.search.results.slice(start, end);

 };

 // for updating servings function

 export const updateServings = function(newServings){

    state.recipe.ingredients.forEach(ing => {
        // newQT = oldQT *  newServings /oldServings // 2 * 8 / 4 = 4
        ing.quantity = (ing.quantity * newServings) / state.recipe.servings; 
    });
    state.recipe.servings = newServings;

 };


 // bookmarking a recipe

 export const addBookmark = function(recipe){
    //add recipe to the bookmarks array
    state.bookmarks.push(recipe);

    //Mark current recipe as bookmarked
    // if(recipe.id === state.recipe.id)
        state.recipe.bookmarked = true;
    
    //putting the bookmarks to local storage
    persistBookmarks();
 };

 //deleting a bookmark
 export const deleteBookmark = function(id){
     //find
    const index = state.bookmarks.findIndex(el => el.id === id);

    state.bookmarks.splice(index, 1);

    //Mark recipe as not bookmarked
    state.recipe.bookmarked = false;

     //putting the bookmarks to local storage
     persistBookmarks();

 };

 // save bookmarks to localStorage
 // No need to export as function will just be called in the model

 const persistBookmarks = function(){
     localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
 };


 //Taking the bookmarks array from local storage to display on the page
 //IIFE
 (function(){
    const storage = localStorage.getItem('bookmarks');
    if(storage) state.bookmarks = JSON.parse(storage);
 })();

 //uploading a recipe to the API
 // will make a request to the API, so it has to be async
 export const uploadRecipe = async function(newRecipe){ 
        try{
            console.log(newRecipe);
            console.log(Object.entries(newRecipe));
            //create an array of ingredients
            //filtering out the array with ingredients with value
            //map out , removing white space
            const ingredients = Object.entries(newRecipe).filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '').map(ing =>
                //looping through the array, replacing white space with nothing then split with a comma
                //destructure and place in variables quantity, unit and description then return as an object
                //ing[1] coz its still an array ingredient-1 , 0.5,kg,rice
                {
                const ingArray = ing[1].replaceAll(' ', '' ).split(',');

                //check if what was inputted has three values, if not throw an error
                if(ingArray.length !==3) throw new Error('Wrong ingredient format. Please use the correct format');

                const [quantity,unit,description] = ingArray
                //check if theres a value in quantity then convert to a number, else null
                return {quantity: quantity ? +quantity: null ,unit,description}  
                });

        //formatting the newRecipe data to the format byt which the data was first received.
        const recipe = {
            title : newRecipe.title,
            source_url : newRecipe.sourceUrl,
            image_url : newRecipe.image,
            publisher : newRecipe.publisher,
            cooking_time : +newRecipe.cookingTime,
            servings : +newRecipe.servings,
            ingredients
        };           
            console.log(recipe);  
            //Post request function sendJson  
            const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);      
            console.log(data);  
            state.recipe = createRecipeObject(data);
            addBookmark(state.recipe); 
        }catch(err){
                throw err;
            };       
    };

