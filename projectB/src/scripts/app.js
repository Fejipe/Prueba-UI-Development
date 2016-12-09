const App = ( () => {
    const reqListener = function () {
        let xhrResponse = JSON.parse( this.responseText );

        // There is a few coupling here...
        // Without a framework, that is the best that we can
        // afford.
        let tree = new RenderTree( xhrResponse );
		tree.render( this.target );
    };

    const init = ( data = {} ) => {
        let oReq = new XMLHttpRequest();
        oReq.addEventListener( 'load', reqListener );
        oReq.target = data.target;
        oReq.open( data.method, data.url );
        oReq.send();
	};

	return {
		init: init
	};
} )();

/**
 * API USAGE
 *
 */
let data = {
    url: '../data/menu.json',
    method: 'get',
    target: '#sidenav'
};

let btn = document.getElementById( 'loadJson' );
btn.addEventListener( 'click', () => App.init( data ), false );