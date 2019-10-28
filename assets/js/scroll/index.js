import { isVisible } from '../helpers';

const figures = Array.from( document.querySelectorAll( '.parallax' ) );
const fadeIns = Array.from( document.querySelectorAll( '.fade-in, .wp-block-column, .wp-block-media-text__media' ) );

let wpadminbar = document.getElementById( 'wpadminbar' );
let scrollPos = 0;
let scrollTimeout;

/**
 * Parallax scrolling effect.
 */
const parallax = () => {
	figures.forEach( ( figure ) => {
		if ( isVisible( figure ) ) {
			wpadminbar = wpadminbar || document.getElementById( 'wpadminbar' );

			const adminBarHeight = wpadminbar ? wpadminbar.clientHeight : 0;
			const scrolled = ( figure.parentElement.getBoundingClientRect().top ) - adminBarHeight;
			const opacity = 1 - 3 * Math.abs( scrolled / 1000 );

			figure.style.transform = `translateY(${ Math.round( scrolled / 4 ) }px)`;
			figure.style.opacity = opacity;
		}
	} );
};

/**
 * Fade-in elements when visible for the first time.
 */
const handleVisible = () => {
	fadeIns.forEach( ( fadeIn ) => {
		if ( ! fadeIn.classList.contains( 'visible' ) ) {
			if ( isVisible( fadeIn ) ) {
				const delay = Math.floor( Math.random() * 1000 );

				window.setTimeout( () => {
					fadeIn.classList.add( 'visible' );
				}, delay );
			}
		}
	} );
};

/**
 * On scroll.
 */
const handleScroll = ( e ) => {
	if ( scrollTimeout ) {
		window.cancelAnimationFrame( scrollTimeout );
	}

	scrollTimeout = window.requestAnimationFrame( () => {
		const newPos = window.pageYOffset || document.documentElement.scrollTop;

		scrollPos = newPos;

		if ( scrollPos >= 50 ) {
			document.body.classList.add( 'scrolled' );
		} else {
			document.body.classList.remove( 'scrolled' );
		}

		parallax();
		handleVisible();
	} );
};

export default () => {
	window.addEventListener( 'resize', handleScroll );
	window.addEventListener( 'scroll', handleScroll );

	window.onload = () => {
		parallax();
		handleVisible();
	};
};