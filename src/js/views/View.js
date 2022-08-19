import icons from 'url:../../img/icons.svg';

export default class View {
    _data;
    render(data){
        // guard clause and chec if data is an array that is empty
        if(!data || (Array.isArray(data) && data.length === 0)) return this.renderError();    

        this._data = data;
        console.log(data);
        const markup = this._generatorMarkup();
        this._clear();
        this._parentEl.insertAdjacentHTML('afterbegin', markup);
      };

      ///////////////////////////////////////////////////////////////////////////////////////

      // Algo for updating data that changed
      // prevent reloading the entire DOM, eliminating flickering of images
      update(data){
        //should not be included to not show the error when no ID
        // if(!data || (Array.isArray(data) && data.length === 0)) return this.renderError();    

        this._data = data;
        console.log(data);
        const newMarkup = this._generatorMarkup();

        // convert string to nodeobject // creating a virtual DOM in the memory!
        const newDOM = document.createRange().createContextualFragment(newMarkup);

        // creting an object and selecting all the elements of the virtual DOM, Array.from (convert nodelist to Array)
        const newElements = Array.from(newDOM.querySelectorAll('*'));
        console.log(newElements);

        //Selecting all the elements of the current DOM
        const curElements = Array.from(this._parentEl.querySelectorAll('*'));
        console.log(curElements);

        //comparing the current elements of the current DOM to the elements of the virtual DOM
        newElements.forEach((newEl, i) => {
          const curEl = curElements[i];

        //checks if new Dom not equal to cur DOM and only elements with a firstchild(value) and trims white spaces with optional chaning( checking if first child has a value)
          if(!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !== ''){
            curEl.textContent = newEl.textContent;
          };

          // updates changed Attributes, copy new attributes from the old to the new
          if(!newEl.isEqualNode(curEl))
            Array.from(newEl.attributes).forEach(attr => curEl.setAttribute(attr.name, attr.value));

        });
        
      };

      ///////////////////////////////////////////////////////////////////////////////////////////

    renderSpinner(){
        const spin = `<div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div>`;      
        this._clear();
        this._parentEl.insertAdjacentHTML('afterbegin', spin);
      };

      //displaying Error Message
    renderError(message = this._errorMessage){
        const markup = `<div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>`;
        this._clear();
        this._parentEl.insertAdjacentHTML('afterbegin', markup);
    }

     //displaying Success Message
    renderMessage(message = this._message){
        const markup = `<div class="message">
            <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>`;
        this._clear();
        this._parentEl.insertAdjacentHTML('afterbegin', markup);
    }
      
    _clear(){
        this._parentEl.innerHTML = '';
    };
}