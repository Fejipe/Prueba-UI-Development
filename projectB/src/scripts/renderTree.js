class RenderTree {
	constructor ( data = {}, keyword = 'menu' ) {
		this.data = data;
		this.keyword = keyword;
		this.output = '';

		if ( typeof this.data[ keyword ] === 'undefined' ) {
	        console.warn( 'Missing keyword in JSON...' );

	        return false;
	    }

	    if ( ! Array.isArray( this.data[ keyword ] ) ) {
	        console.warn( 'Keyword is not an hierarchical structure...' );

	        return false;
	    }
	}

    /**
     * toggleClassDom
     * Switching between two classes on a given DOM element
     * Needed for IE9>
     *
     * @param  {String} _class
     * @param  {Object} element
     * @return  Boolean|void
     */
    static toggleClassDom ( _class, element ) {
        if ( ! element || typeof _class !== 'string' ) {
            return false;
        }
        element.className = ( element.className &&
            element.className.trim().split( /\s+/gi ).indexOf( _class ) > -1 ) ? '' : _class;
    }

    /**
     * toArray
     * Function for parsing an object into an array
     * Needed for IE9>
     *
     * @param  {Object} obj
     * @return {Array}
     */
    static toArray ( obj ) {
        var array = [];

        for ( let i = obj.length >>> 0; i--; ) {
            array[ i ] = obj[ i ];
        }

        return array;
    }

    /**
     * emptyNode
     *
     * @statci
     * @param  {Object} node
     * @return void
     */
    static emptyNode ( node ) {
        while ( node.firstChild ) {
            node.removeChild( node.firstChild );
        }
    }

	/**
	 * printContentPage
	 *
	 * @static
	 * @return void
	 */
	static printContentPage () {
		let output = this.responseText,
			target = document.querySelector( this.target );

		RenderTree.emptyNode( target );
		target.insertAdjacentHTML( 'beforeend', output );
    }

    /**
     * requestPage
     *
     * @static
     * @param  {objet} data
     * @param  {string} selector
     * @return void
     */
    static requestPage ( data, selector ) {
        let oReq = new XMLHttpRequest();
        oReq.addEventListener( 'load', RenderTree.printContentPage );
        oReq.target = selector;
        oReq.open( data.method, data.url );
        oReq.send();
    }

    /**
     * renderNode
     *
     * @param  {Object} data
     * @return void
     */
    renderNode ( data ) {
        this.openNode( data );
        this.openAnchor( data );
        this.addNodeContent( data );
        this.closeAnchor();
    }

    /**
     * openNodeRoot
     *
     * @param  {Object} data
     * @return void
     */
    openNodeRoot ( data = {} ) {
    	this.output += `<ul class="${ data.class || '' }">`;
    }

    /**
     * closeNodeRoot
     *
     * @return void
     */
    closeNodeRoot () {
    	this.output += '</ul>';
    }

    /**
     * openNode
     *
     * @param  {Object}	data
     * @return void
     */
    openNode ( data = {} ) {
    	this.output += `<li id="${ data.id }" class="${ data.cssClass }">`;
    }

    /**
     * closeNode
     *
     * @return void
     */
    closeNode () {
    	this.output += '</li>';
    }

    /**
     * openAnchor
     *
     * @param  {Object}	data
     * @return void
     */
    openAnchor ( data = {} ) {
    	this.output += `<a title="${ data.id }" href="${ data.content || '#' }">`;
    }

    /**
     * closeAnchor
     *
     * @return void
     */
    closeAnchor () {
    	this.output += '</a>';
    }

    /**
     * addNodeContent
     *
     * @param  {Object}	data
     * @return void
     */
    addNodeContent ( data = {} ) {
    	this.output += data.description;
    }

    /**
     * traverseData
     *
     * @param  {Object} data
     * @return void
     */
    traverseData ( data = {} ) {
        let collection = data[ this.keyword ];

        for ( let key in collection ) {
            let currentItem = collection[ key ];

            this.renderNode( collection[ key ] );

            if ( currentItem[ this.keyword ] !== null &&
            	Array.isArray( currentItem[ this.keyword ] ) ) {
	                this.openNodeRoot( { class: 'hidden' } );
	                this.traverseData( currentItem );
	                this.closeNodeRoot();
            }

            this.closeNode();
        }
    }

    /**
     * openChild
     *
     * @param  {Object} e
     * @return {Boolean} false
     */
    openChild ( e ) {
    	e.preventDefault();

    	let child = e.target.nextSibling;
        RenderTree.toggleClassDom( 'hidden', child );
    	RenderTree.toggleClassDom( 'open', e.target );

        //child.classList.toggle( 'hidden' );
    	//e.target.classList.toggle( 'open' );

    	return false;
    }

    /**
     * renderPage
     *
     * @param  {Object} e
     * @return {Boolean} false
     */
    renderPage ( e ) {
    	e.preventDefault();

    	let pageToRender = e.target.getAttribute( 'href' );

    	RenderTree.requestPage( { url: pageToRender, method: 'get' }, '#contentPage' );

    	return false;
    }

    /**
     * addListeners
     *
     * @param {Object} node
     * @return void
     */
    addListeners ( node ) {
    	let anchors = RenderTree.toArray( node.querySelectorAll( 'a' ) );

		anchors.map( item => {
			item.addEventListener( 'click',
				( item.getAttribute( 'href' ) === '#' ) ?
					this.openChild :
					this.renderPage, false );
		} );
    }

    /**
     * render
     *
     * @param  {String} selector
     * @return {Boolean|void}
     */
    render ( selector ) {
        let elementDom = document.querySelector( selector );

        if ( ! elementDom ) {
            console.warn( 'Missing target element in DOM...' );

            return false;
        }

        this.openNodeRoot();
        this.traverseData( this.data );
        this.closeNodeRoot();

        RenderTree.emptyNode( elementDom );
        elementDom.insertAdjacentHTML( 'beforeend', this.output );
        this.addListeners( elementDom );
    }
}