import { getNestedProperty } from '../helpers';

const baseUrl = getNestedProperty( window.baseUrl, [ 'url' ] );
const images = Array.from( document.querySelectorAll( '.expandable' ) );

/**
 * Get full-sized image URL for the given attachment ID and
 * swap into given <img /> element.
 *
 * @param {object} img <img /> element to update src for
 * @param {string} id  Attachment ID to get full image URL for
 */
const fetchFullImage = ( img, id ) => {
	const url = `${ baseUrl }media/${ id }`;
	const xhr = new XMLHttpRequest();

	/**
	 * Request handler.
	 */
	xhr.onreadystatechange = () => {

		/**
		 * Only run once request is complete.
		 */
		if ( 4 !== xhr.readyState ) {
			return;
		}

		/**
		 * Run on successful request.
		 */
		if ( 200 <= xhr.status && 300 > xhr.status ) {
			const response = JSON.parse( xhr.response );
			const fullSrc = response.source_url;

			if ( fullSrc ) {
				const imgHeight = img.clientHeight;

				img.style.height = `${ imgHeight }px`;
				img.setAttribute( 'src', fullSrc );
			}
		} else {
			const error = JSON.parse( xhr.responseText );

			console.error( error.message );
		}
	}

	xhr.open( 'GET', url );
	xhr.send();
};

/**
 * Create modal element if it doesn't exist.
 *
 * @param {string} src        Image URL for initial <img /> src
 * @param {string} id         Attribute ID of image
 * @param {object} figcaption Caption element, if it exists
 */
const createModal = ( src, id, figcaption ) => {
	const modal = document.createElement( 'div' );
	const figure = document.createElement( 'figure' );
	const img = document.createElement( 'img' );
	const closeBtn = document.createElement( 'button' );
	const span = document.createElement( 'span' );
	const caption = figcaption ? figcaption.cloneNode( true ) : null;

	modal.className = 'modal';
	modal.setAttribute( 'id', `modal-${ id }` );

	img.setAttribute( 'src', src );

	closeBtn.className = 'close';
	span.className = 'screen-reader-text';
	span.textContent = 'Close modal';

	closeBtn.appendChild( span );
	modal.addEventListener( 'click', ( e ) => {
		const element = e.target.tagName.toLowerCase();
		if ( element === 'div' || element === 'button' || element === 'figure' ) {
			modal.classList.remove( 'active' );
			document.documentElement.classList.remove( 'modal-open' );
		}
	 } );

	figure.appendChild( img );

	if ( caption ) {
		figure.appendChild( caption );
	} else {
		img.style.height = '100%';
	}

	modal.appendChild( figure );
	modal.appendChild( closeBtn );

	document.body.appendChild( modal );
	document.documentElement.classList.add( 'modal-open' );

	fetchFullImage( img, id );
	window.setTimeout( () => modal.classList.add( 'active' ) );
};

/**
 * Handle click event on image elements. Create or open modal.
 *
 * @param {event} e Click event.
 */
const handleClick = ( e ) => {
	const img = e.currentTarget.querySelector( 'img' );

	if ( ! img ) {
		return;
	}

	const id = img.className.split( '-' ).pop();
	const src = img.getAttribute( 'src' );
	const figcaption = img.nextElementSibling;
	const modal = document.getElementById( `modal-${ id }` );

	if ( modal ) {
		modal.classList.add( 'active' );
		document.documentElement.classList.add( 'modal-open' );
		return;
	} else {
		createModal( src, id, figcaption );
	}
};

export default () => {
	if ( ! baseUrl ) {
		return;
	}

	images.forEach( ( image ) => {
		image.addEventListener( 'click', handleClick );
	} );
};
