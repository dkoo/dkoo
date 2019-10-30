<?php
/**
 * Main nav menu.
 */

if ( has_nav_menu( 'primary' ) && ! is_404() ) : ?>
<nav class="primary-nav">
	<div class="container">
		<?php
		get_template_part( 'template-parts/logo' );

		wp_nav_menu(
			[
				'theme_location'  => 'primary'
			]
		);
		?>
	</div>
</nav>
<?php endif; ?>
