import View from './View.js';
import icons from 'url:../../img/icons.svg';


class AddRecipeView extends View {
    _message = 'Recipe was successfully uploaded...'
    _parentEl = document.querySelector('.upload');
    _window = document.querySelector('.add-recipe-window');
    _overlay = document.querySelector('.overlay');  
    _btnOpen = document.querySelector('.nav__btn--add-recipe');
    _btnClose = document.querySelector('.btn--close-modal');
    
    constructor(){
        super();
        this._addHandlerShowWindow();
        this._addHandlerHideWindow();
    };
      
    toggleWindow(){
        this._overlay.classList.toggle('hidden');
        this._window.classList.toggle('hidden');
    };

    _addHandlerShowWindow(){
        this._btnOpen.addEventListener('click', this.toggleWindow.bind(this)); 
    };

    _addHandlerHideWindow(){
        this._btnClose.addEventListener('click', this.toggleWindow.bind(this)); 
        this._overlay.addEventListener('click', this.toggleWindow.bind(this)); 
    };

    addHandlerUpload(handler){
        this._parentEl.addEventListener('submit', function(e){
            e.preventDefault();
            // modern form browser API, getting all the data from a form submit : FormData
            const dataArr = [...new FormData(this)];
            // convert entries to object : Object.fromEntries
            const data = Object.fromEntries(dataArr);
            handler(data);
        })
    };

};

export default new AddRecipeView();