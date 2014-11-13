<?php

/**
 * Class VR_Kiwiberry_Block_Directory_Data
 */
class VR_Kiwiberry_Block_Customer_Form_Register extends Mage_Customer_Block_Form_Register
{
    /**
     * Get country html select
     *
     * @param null $defValue Default value
     * @param string $name name
     * @param string $id ID
     * @param string $title Title
     * @return mixed
     */
    public function getCountryHtmlSelect($defValue=null, $name='country_id', $id='country', $title='Country')
    {
        Varien_Profiler::start('TEST: '.__METHOD__);
        if (is_null($defValue)) {
            $defValue = $this->getCountryId();
        }
        $cacheKey = 'DIRECTORY_COUNTRY_SELECT_STORE_'.Mage::app()->getStore()->getCode();
        if (Mage::app()->useCache('config') && $cache = Mage::app()->loadCache($cacheKey)) {
            $options = unserialize($cache);
        } else {
            $options = $this->getCountryCollection()->toOptionArray();
            if (Mage::app()->useCache('config')) {
                Mage::app()->saveCache(serialize($options), $cacheKey, array('config'));
            }
        }
        $html = $this->getLayout()->createBlock('core/html_select')
            ->setName($name)
            ->setId($id)
            ->setTitle(Mage::helper('directory')->__($title))
            ->setClass('form-control validate-select')
            ->setValue($defValue)
            ->setOptions($options)
            ->getHtml();

        Varien_Profiler::stop('TEST: '.__METHOD__);
        return $html;
    }
}
