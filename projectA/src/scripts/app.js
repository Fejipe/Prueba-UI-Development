let menuBtn = document.getElementById( 'menu-toggle' ),
	closeBtn = document.querySelector( '.close-btn' ),
	mainLayer = document.querySelector( '.transformer' );

//const toggleMenu = () => mainLayer.classList.toggle( 'is-open' );

/**
 * toggleClassDom
 * Switching between two classes on a given DOM element
 * Needed for IE9>
 *
 * @param  {String} _class
 * @param  {Object} element
 * @return  Boolean|void
 */
const toggleClassDom = ( _class, element ) => {
    if ( ! element || typeof _class !== 'string' ) {
        return false;
    }

    if ( element.className &&
        element.className.trim().split( /\s+/gi ).indexOf( _class ) > -1 ) {
    	element.className = 'transformer';
    } else {
    	element.className += ' ' + 'is-open';
    }
};

/**
 * toggleMenu
 *
 * @return void
 */
const toggleMenu = () => {
	toggleClassDom( 'is-open', mainLayer );
}

// Listeners
menuBtn.addEventListener( 'click', toggleMenu );
closeBtn.addEventListener( 'click', toggleMenu );