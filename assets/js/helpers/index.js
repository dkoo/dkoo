/**
 * Check if given element is visible in viewport.
 * @param {element} el Element to check for visibility
 */
export const isVisible = ( el ) => {
	const coords = el.getBoundingClientRect();

	if (coords) {
		return (
			(
				coords.top >= 0 &&
				coords.top <= ( window.innerHeight || document.documentElement.clientHeight )
			)
			||
			(
				coords.bottom >= 0 &&
				coords.bottom <= ( window.innerHeight || document.documentElement.clientHeight )
			)
		);
	}

	return false;
};

/**
 * Update URL with given {hash}.
 * @param {string} hash Hash to append to URL. Expected to start with '#'
 */
const updateHistory = ( hash ) => {
	if ( history ) {
		history.pushState( null, null, hash );
	} else {
		window.location.hash = hash;
	}
}

/**
 * Scroll given {element} into view.
 * If {element} contains an anchor, focus it after completing the scroll.
 * @param {element} el Element to scroll into view.
 */
export const smoothScroll = ( el, hash ) => {
	el.scrollIntoView( {
		behavior: 'smooth'
	} );

	updateHistory( hash );
};

/**
 * Get deeply nested property from an object, if it exists.
 */
export const getNestedProperty = ( nestedObj, pathArr ) => {
	return pathArr.reduce( ( obj, key ) =>
		( obj && 'undefined' !== obj[key] ) ? obj[key] : undefined, nestedObj );
}

/**
 * On in-page anchor link click.
 */
const handleClick = ( e ) => {
	const hash = e.currentTarget.getAttribute( 'href' );
	const goto = document.getElementById( hash.substring( 1 ) );

	if ( goto ) {
		smoothScroll( goto, hash );

		e.preventDefault();
	}
};

/**
 * General event listeners.
 */
const events = () => {
	const inPageAnchors = document.querySelectorAll( 'a[href^="#"]' );

	inPageAnchors.forEach( anchor => anchor.addEventListener( 'click', handleClick ) );
};

export default () => {
	events();
};
