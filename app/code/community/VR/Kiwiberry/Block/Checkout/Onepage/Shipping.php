<?php

/**
 * Class VR_Kiwiberry_Block_Checkout_Onepage_Shipping
 */
class VR_Kiwiberry_Block_Checkout_Onepage_Shipping extends Mage_Checkout_Block_Onepage_Shipping
{
    /**
     * Get the HTML of country selection
     *
     * @param string $type Billing or Shipping
     * @return string The HTML of country selection
     */
    public function getCountryHtmlSelect($type)
    {
        $countryId = $this->getAddress()->getCountryId();
        if (is_null($countryId)) {
            $countryId = Mage::helper('core')->getDefaultCountry();
        }
        $select = $this->getLayout()->createBlock('core/html_select')
            ->setName($type . '[country_id]')
            ->setId($type . ':country_id')
            ->setTitle(Mage::helper('checkout')->__('Country'))
            ->setClass('validate-select form-control')
            ->setValue($countryId)
            ->setOptions($this->getCountryOptions());
        if ($type === 'shipping') {
            $select->setExtraParams('onchange="if(window.shipping)shipping.setSameAsBilling(false);"');
        }

        return $select->getHtml();
    }
}
