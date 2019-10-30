'use strict';

import { getNestedProperty } from './helpers';

/**
 * @module dkoo/LoadMore
 *
 * @description
 *
 * Create a Load More UI.
 *
 * @param {string} element Element selector for posts container.
 * @param {Object} options Object of optional callbacks.
 */
class LoadMore {

	/**
	 * constructor function
	 * @param element Object
	 * @param options Object
	 */
	constructor( element, options = {} ) {

		/**
		 * Default options.
		 */
		const defaults = {
			onCreate: null,
			onFetch: null,
			onAppend: null,
			onFail: null,
			infiniteScroll: false,
			loadMoreClass: 'load-more',
			singlePostClass: 'post single',
			baseUrl: null, // WP REST API endpoint URL to hit for post query results.

			/**
			 * Arguments to pass for WP REST API /posts request.
			 */
			fetchOptions: {},

			/**
			 * Arguments to pass for WP query.
			 */
			queryArgs: {
				'per_page': 10,
				'offset': 0,
				'_embed': true
			},
		};

		if ( ! element || 'string' !== typeof element ) {
			console.error( 'dkoo Load More: No container target supplied. A valid container target must be used.' ); // eslint-disable-line
			return;
		}

		this.$loadMoreContainer = document.querySelector( element );
		defaults.queryArgs.offset = this.$loadMoreContainer.children.length;

		if ( ! this.$loadMoreContainer ) {
			console.error( 'dkoo Load More: Container target not found. A valid container target must be used.' ); // eslint-disable-line
			return;
		}

		this.element = element;
		document.documentElement.classList.add( 'js' );

		/**
		 * Apply settings.
		 */
		this.settings = Object.assign( {}, defaults, options );
		this.setupLoadMore( this.$loadMoreContainer );

		/**
		 * Called after the Load More area is initialized on page load.
		 * @callback onCreate
		 */
		if ( this.settings.onCreate && 'function' === typeof this.settings.onCreate ) {
			this.settings.onCreate.call();
		}
	}

	/**
	 * Initialize a given Load More area.
	 * Configure properties and set ARIA attributes.
	 *
	 * @param   {element} loadMoreArea      The loadMoreArea to scope changes.
	 * @param   {number}  loadMoreAreaIndex The index of the loadMoreArea.
	 * @returns {null}
	 */
	setupLoadMore( loadMoreArea ) {
		const trigger = document.querySelector( '.' + this.settings.loadMoreClass.replace( ' ', '.' ) );

		if ( trigger ) {
			trigger.addEventListener( 'click', this.fetchMorePosts.bind( this ) );
		} else {
			console.error( 'dkoo Load More: Load more button trigger element not found. Each load more container must contain a valid trigger element.' ); // eslint-disable-line
		}
	}

	/**
	 * Fetch more posts using the WP REST API /posts endpoint.
	 *
	 * @param  {Object} event The click event for the "load more" button.
	 * @return {null}
	 */
	fetchMorePosts( event ) {
		const button = event.currentTarget;
		const params = this.settings.queryArgs;
		const xhr = new XMLHttpRequest();

		let url = this.settings.baseUrl + 'posts/';

		if ( !url ) {
			return console.error( 'dkoo Load More: Must pass a base URL for the WordPress REST API.' );
		}

		/**
		 * Append query params.
		 */
		Object.keys( params ).forEach( ( key, index ) => {
			url += ( 0 === index ? '?' : '&' ) + encodeURIComponent( key ) + ( true === params[key] ? '' : '=' + encodeURIComponent( params[key] ) );
		} );

		/**
		 * Set class name of button while loading.
		 */
		button.classList.add( 'loading' );

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
			 * Remove "loading" class name of button after response is fetched.
			 */
			button.classList.remove( 'loading' );

			/**
			 * Run on successful request.
			 */
			if ( 200 <= xhr.status && 300 > xhr.status ) {
				const posts = this.renderPosts( JSON.parse( xhr.response ) );

				/**
				 * Update offset param for next query.
				 */
				this.settings.queryArgs.offset += this.settings.queryArgs.per_page;

				/**
				 * Update total posts count.
				 */
				this.settings.total = xhr.getResponseHeader( 'x-wp-total' ) || 0;

				if ( posts ) {

					/**
					 * Called just before the fetched posts HTML is appended to the DOM.
					 * @callback onAppend
					 */
					if ( this.settings.onAppend && 'function' === typeof this.settings.onAppend ) {
						this.settings.onAppend.call();
					}

					/**
					 * Append posts fragment to DOM.
					 */
					this.$loadMoreContainer.appendChild( posts );

					/**
					 * Append post_count query param to URL.
					 */
					window.history.pushState(
						{},
						document.title,
						window.location.href.replace( window.location.search, '' ) + '?post_count=' + ( this.settings.queryArgs.offset )
					);

					/**
					 * Remove Load More button if there are no more posts to fetch.
					 */
					if ( this.settings.queryArgs.offset >= this.settings.total ) {
						button.parentElement.removeChild( button );
					}
				}
			} else {
				const error = JSON.parse( xhr.responseText );

				console.error( error.message );

				/**
				 * Called if the fetch API request fails.
				 * @callback onFail
				 */
				if ( this.settings.onFail && 'function' === typeof this.settings.onFail ) {
					this.settings.onFail.call();
				}
			}
		};

		/**
		 * Called just before the fetch API request is sent.
		 * @callback onFetch
		 */
		if ( this.settings.onFetch && 'function' === typeof this.settings.onFetch ) {
			this.settings.onFetch.call();
		}

		xhr.open( 'GET', url );
		xhr.send();
	}

	/**
	 * Append post elements given an array of WP post query results.
	 *
	 * @param  {array} posts Array of post objects from WP query.
	 * @return {null}
	 */
	renderPosts( posts ) {
		if ( ! Array.isArray( posts ) ) {
			console.error( 'dkoo Load More: Expected an array of posts.' );
			return;
		}
		let html;

		const fragment = document.createDocumentFragment();
		const div = document.createElement( 'div' );

		posts.forEach( post => {
			fragment.appendChild( this.createSinglePostHtml( post ) );
		} );

		return fragment;
	}

	createSinglePostHtml( post ) {
		const container = document.createElement( 'li' );
		const excerpt = getNestedProperty( post, [ 'excerpt', 'rendered' ] );

		let html = `
			<article id="post-${ post.id }" class="${ this.settings.singlePostClass }" itemscope itemtype="http://schema.org/BlogPosting">
		`;

		html += `
				<a href="${ post.link }" class="article-link" itemprop="url">
					<h2>${ post.title.rendered }</h2>
					${ excerpt }
				</a>
		`;

		if ( post.tag_info.length > 0 ) {
			html += '<ul class="tags">';
			post.tag_info.forEach( ( tag ) => {
				html += `
					<li><a href="${ tag.url }">${ tag.name }</a></li>
				`;
			} );
			html += '</ul>';
		}

		html += '</article>';

		container.innerHTML = html;

		return container;
	}
}

if ( document.querySelector( '.load-more' ) ) {
	new LoadMore( '.articles-list', {
		baseUrl: window.baseUrl.url
	} );
}
