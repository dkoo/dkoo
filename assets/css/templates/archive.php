<?php
/**
 * Blog listing template.
 */

get_header(); ?>

<h1>Articles</h1>

<?php if ( have_posts() ) : ?>
	<article id="post-<?php the_ID(); ?>" <?php post_class( 'container' ); ?>>
	<?php
	while ( have_posts() ) :
		the_post();
		?>
		<?php the_content(); ?>
	<?php endwhile; ?>
	</article>
<?php endif; ?>

<?php
get_footer();
