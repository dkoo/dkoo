<?php
/**
 * WP Theme constants and setup functions
 *
 * @package Dkoo
 */

// Useful global constants.
define( 'DKOO_VERSION', '1.0.0' );
define( 'DKOO_TEMPLATE_URL', get_template_directory_uri() );
define( 'DKOO_PATH', get_template_directory() . '/' );
define( 'DKOO_INC', DKOO_PATH . 'includes/' );

require_once DKOO_INC . 'core.php';

// Run the setup functions.
Dkoo\Core\setup();
