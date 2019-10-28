/**
 * FOUT with a Class: https://github.com/zachleat/web-font-loading-recipes/blob/master/fout-with-class.html
 */
export default () => {
	// Optimization for Repeat Views
	if ( sessionStorage.fontsLoadedFoutWithClass ) {
		document.documentElement.className += ' fonts-loaded';
		return;
	}
	if ( 'fonts' in document ) {
		Promise.all( [
			document.fonts.load('1em Montserrat'),
			document.fonts.load('700 1em Montserrat'),
			document.fonts.load('italic 1em Montserrat'),
			document.fonts.load('italic 700 1em Montserrat')
		] ).then( () => {
			document.documentElement.className += ' fonts-loaded';
			// Optimization for Repeat Views
			sessionStorage.fontsLoadedFoutWithClass = true;
		} );
	}
};
