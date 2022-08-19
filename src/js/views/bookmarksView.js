
import icons from 'url:../../img/icons.svg';
import PreviewView from './previewView.js';

class BookmarksView extends PreviewView {
    _parentEl = document.querySelector('.bookmarks__list');
    _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it!';
    _message = '';  
   
    addBookmarkHandler(handle){
        window.addEventListener('load', handle)
    };
};

export default new BookmarksView();