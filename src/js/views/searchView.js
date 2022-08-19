import View from './View.js';
import icons from 'url:../../img/icons.svg';

class SearchView extends View{
    _parentEl = document.querySelector('.search');
    _errorMessage = 'Please enter a query';     

    //method to get the query or input from the form
    getQuery(){
         const query = this._parentEl.querySelector('.search__field').value;
         this.clearInput();
         return query;
    };

    clearInput(){
        this._parentEl.querySelector('.search__field').value = '';
    };


    addhandlerSearch(handler){
        this._parentEl.addEventListener('submit', (e) => {                                  
            e.preventDefault();   
            handler();
        });
    };
};

export default new SearchView();