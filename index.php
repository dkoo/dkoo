<?php
/**
 * The main template file
 *
 * @package Dkoo
 */

get_header(); ?>

<h1><?php echo esc_html( get_the_title( get_option( 'page_for_posts', true ) ) ); ?></h1>

<?php if ( is_home() ) : ?>
<h3>A collection of thoughts.</h3>
<?php elseif ( is_archive() ) : ?>
<h3>#<?php single_tag_title(); ?></h3>
<?php endif; ?>

<?php if ( have_posts() ) : ?>
	<ul class="articles-list">
	<?php
	while ( have_posts() ) :
		the_post();
		?>
		<li>
			<article id="post-<?php the_ID(); ?>" itemscope itemtype="http://schema.org/BlogPosting">
				<a itemprop="url" class="article-link" href="<?php echo esc_url( the_permalink() ); ?>" title=<?php echo esc_attr( the_title() ); ?>>
					<h2><?php the_title(); ?></h2>
					<?php the_excerpt(); ?>
				</a>

				<?php
				$tags = get_the_tags();

				if ( ! empty( $tags ) ) : ?>
				<ul class="tags">
					<?php foreach ( $tags as $tag ) : ?>
						<li>
							<a href="<?php echo esc_url( get_tag_link( $tag ) ); ?>">#<?php echo esc_html( $tag->name ); ?></a>
						</li>
					<?php endforeach; ?>
				</ul>
				<?php endif; ?>
			</article>
		</li>
	<?php endwhile; ?>
	</ul>

	<?php
	$posts_per_page = get_option( 'posts_per_page' );
	$initial_posts = $wp_query->post_count;
	$post_count = $wp_query->found_posts;

	if ( $post_count > $posts_per_page && $post_count > $initial_posts ) :
	?>
	<button class="load-more">Load More</button>
	<?php endif; ?>
<?php else : ?>
	<p><em>No articles found.</em></p>
<?php endif; ?>

<?php
get_footer();
