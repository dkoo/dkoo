<?php
/**
 * The template for displaying the header.
 *
 * @package Dkoo
 */

?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
	<head>
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<?php wp_head(); ?>
	</head>
	<body <?php body_class(); ?>>
		<?php do_action( 'after_body' ); ?>

		<?php get_template_part( 'template-parts/menu' ); ?>

		<main class="wrapper <?php if ( is_home() || ! is_page() ) : ?>container<?php endif ?>">
