<?php

/**
 * Created by PhpStorm.
 * User: roc
 * Date: 7/08/14
 * Time: 10:01 PM
 */
class VR_KiwiFruit_Helper_Data extends Mage_Core_Helper_Abstract
{
    public function getFaIconClass($label)
    {
        $map = array(
            'My Account'  => 'fa-user',
            'My Wishlist' => 'fa-heart',
            'My Cart'     => 'fa-shopping-cart',
            'Checkout'    => 'fa-credit-card',
            'Log In'      => 'fa-sign-in',
            'Log Out'     => 'fa-sign-out',
        );

        return isset($map[$label]) ? $map[$label] : false;
    }
}
