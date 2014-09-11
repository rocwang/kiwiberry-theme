<?php

/**
 * Helper class for kiwiberry theme package
 */
class VR_Kiwiberry_Helper_Data extends Mage_Core_Helper_Abstract
{
    /**
     * Get CSS class name of font awesome icon from label
     *
     * @param $label
     * @return string|bool the class name or false on failure
     */
    public function getFaIconClassFromLabel($label)
    {
        $map = array(
            'My Account'  => 'fa-user',
            'My Wishlist' => 'fa-heart',
            'My Cart'     => 'fa-shopping-cart',
            'Checkout'    => 'fa-credit-card',
            'Log In'      => 'fa-sign-in',
            'Log Out'     => 'fa-sign-out',
            'Grid'        => 'fa-th',
            'List'        => 'fa-list',
            'Asc'         => 'fa-sort-amount-asc',
            'Desc'        => 'fa-sort-amount-desc',
        );

        return isset($map[ucwords($label)]) ? $map[$label] : false;
    }
}
