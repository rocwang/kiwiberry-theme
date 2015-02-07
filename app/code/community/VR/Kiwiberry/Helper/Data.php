<?php

/**
 * Helper class for kiwiberry theme package
 */
class VR_Kiwiberry_Helper_Data extends Mage_Core_Helper_Abstract
{
    /**
     * Render SVG icon
     *
     * @param $iconName The icon name, which is used as class name as well.
     * @return string The SVG icon
     */
    function getSvgIcon($iconName, $extraClasses = '')
    {
        return sprintf(
            '<svg class="icon icon-%s %s"><use xlink:href="%s#%s"></use></svg>',
            $iconName,
            $extraClasses,
            Mage::getDesign()->getSkinUrl('images/icons.svg'),
            $iconName
        );
    }
}
