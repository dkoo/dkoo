<?php
/**
 * 404 page tempate.
 *
 * @package Dkoo
 */

get_header(); ?>

<div class="not-found">
	<h1>Whoops</h1>

	<p>You seem to have stumbled upon a place that doesn’t exist. Try going <a href="<?php echo esc_url( bloginfo( 'url' ) ); ?>">home</a> if you can’t find what you’re looking for.</p>
</div>

<?php
get_footer();
