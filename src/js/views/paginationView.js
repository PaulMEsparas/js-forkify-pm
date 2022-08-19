import View from './View.js';
import icons from 'url:../../img/icons.svg';

class paginationView extends View {
    _parentEl = document.querySelector('.pagination');


    addHandlerClick(handler){
        this._parentEl.addEventListener('click', function(e){
            const btn = e.target.closest('.btn--inline');

            if(!btn) return; 

            const goToPage = +btn.dataset.goto;


            handler(goToPage);
        })
    };
  

    _generatorMarkup(){
        //compute how many pages there are
        const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);
        const currPage = this._data.page;
     
                // <button class="btn--inline pagination__btn--prev">
                //     <svg class="search__icon">
                //     <use href="src/img/icons.svg#icon-arrow-left"></use>
                //     </svg>
                //     <span>Page 1</span>
                // </button>
                // <button class="btn--inline pagination__btn--next">
                //     <span>Page 3</span>
                //     <svg class="search__icon">
                //     <use href="src/img/icons.svg#icon-arrow-right"></use>
                //     </svg>
                // </button>


        // page 1 and there are other pages
        if(currPage === 1 && numPages > 1){
            return `<button data-goto="${currPage + 1}" class="btn--inline pagination__btn--next">
            <span>Page ${currPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>`
        }
        
        // last page
        if(currPage === numPages && numPages > 1){
            return ` <button data-goto="${currPage - 1}" class="btn--inline pagination__btn--prev">
                    <svg class="search__icon">
                        <use href="${icons}#icon-arrow-left"></use>
                    </svg>
                    <span>Page ${currPage - 1}</span>
                    </button>`
        }

        // other page
        if(currPage< numPages){
            return `<button data-goto="${currPage - 1}" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currPage - 1}</span>
          </button>
          <button data-goto="${currPage + 1}" class="btn--inline pagination__btn--next">
            <span>Page ${currPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>`
        }
        // page 1 and no other pages
        return ''
    }
}

export default new paginationView();