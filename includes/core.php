<?php
/**
 * Core setup, site hooks and filters.
 *
 * @package ThemeScaffold\Core
 */

namespace Dkoo\Core;

/**
 * Set up theme defaults and register supported WordPress features.
 *
 * @return void
 */
function setup() {
	$n = function( $function ) {
		return __NAMESPACE__ . "\\$function";
	};

	add_action( 'after_setup_theme', $n( 'theme_setup' ) );
	add_action( 'wp_enqueue_scripts', $n( 'scripts' ) );
	add_action( 'wp_enqueue_scripts', $n( 'styles' ) );
	add_action( 'wp_head', $n( 'meta' ) );
	add_action( 'pre_get_posts', $n( 'filter_post_count' ) );

	add_filter( 'query_vars', $n( 'filter_query_vars' ), 10, 3 );
	add_filter( 'rest_prepare_post', $n( 'filter_post_json' ), 10, 3 );
	add_filter( 'script_loader_tag', $n( 'script_loader_tag' ), 10, 2 );
}

/**
 * Sets up theme defaults and registers support for various WordPress features.
 */
function theme_setup() {
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'html5' );

	// This theme uses wp_nav_menu() in three locations.
	register_nav_menus(
		[
			'primary' => esc_html__( 'Primary Menu', 'dkoo' ),
			'footer'  => esc_html__( 'Footer Menu', 'dkoo' )
		]
	);
}

/**
 * Enqueue scripts for front-end.
 *
 * @return void
 */
function scripts() {
	wp_enqueue_script(
		'main',
		DKOO_TEMPLATE_URL . '/dist/main.js',
		[],
		DKOO_VERSION,
		true
	);

	if ( is_home() || is_archive() ) {
		wp_enqueue_script(
			'load-more',
			DKOO_TEMPLATE_URL . '/dist/load-more.js',
			[ 'main' ],
			DKOO_VERSION,
			true
		);
	}
}

/**
 * Enqueue styles for front-end.
 *
 * @return void
 */
function styles() {
	wp_enqueue_style(
		'styles',
		DKOO_TEMPLATE_URL . '/dist/styles.css',
		[],
		DKOO_VERSION
	);
}

function meta() {
?>
<meta name="author" content="Derrick Koo" />
<meta name="description" content="Website of Derrick Koo: Colorado-based front-end developer, JavaScript engineer, and all-around cool guy.">
<?php
}

/**
 * Custom query vars.
 */
function filter_query_vars( $vars ) {
	$vars[] = 'post_count';

	return $vars;
}

/**
 * Allow query param to control nubmer of posts shown.
 */
function filter_post_count( \WP_Query $query ) {
	if ( ! is_admin() && $query->is_main_query() ) {
		$post_count = $query->get( 'post_count' );

		if ( ! empty( $post_count ) && 1000 >= (int) $post_count ) {
			$query->set( 'posts_per_page', (int) $post_count );
		}
	}
}

/**
 * Return tag info along with posts REST API response.
 */
function filter_post_json( $response, $post, $context ) {
	$tags = wp_get_post_tags( $post->ID );
	$response->data['tag_info'] = [];

	foreach ( $tags as $tag ) {

		$response->data['tag_info'][] = [
			'id'   => $tag->term_id,
			'name' => $tag->name,
			'url'  => get_tag_link( $tag ),
		];
	}

	return $response;
}

/**
 * Add async/defer attributes to enqueued scripts that have the specified script_execution flag.
 *
 * @link https://core.trac.wordpress.org/ticket/12009
 * @param string $tag    The script tag.
 * @param string $handle The script handle.
 * @return string
 */
function script_loader_tag( $tag, $handle ) {
	$script_execution = wp_scripts()->get_data( $handle, 'script_execution' );

	if ( ! $script_execution ) {
		return $tag;
	}

	if ( 'async' !== $script_execution && 'defer' !== $script_execution ) {
		return $tag; // _doing_it_wrong()?
	}

	// Abort adding async/defer for scripts that have this script as a dependency. _doing_it_wrong()?
	foreach ( wp_scripts()->registered as $script ) {
		if ( in_array( $handle, $script->deps, true ) ) {
			return $tag;
		}
	}

	// Add the attribute if it hasn't already been added.
	if ( ! preg_match( ":\s$script_execution(=|>|\s):", $tag ) ) {
		$tag = preg_replace( ':(?=></script>):', " $script_execution", $tag, 1 );
	}

	return $tag;
}
