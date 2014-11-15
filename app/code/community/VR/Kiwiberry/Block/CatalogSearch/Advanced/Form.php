<?php

/**
 * Class VR_Kiwiberry_Block_CatalogSearch_Advanced_Form
 */
class VR_Kiwiberry_Block_CatalogSearch_Advanced_Form extends Mage_CatalogSearch_Block_Advanced_Form
{
    /**
     * Build attribute select element html string
     *
     * @param Mage_Eav_Model_Entity_Attribute_Abstract $attribute
     * @return string
     */
    public function getAttributeSelectElement($attribute)
    {
        $extra = '';
        $options = $attribute->getSource()->getAllOptions(false);

        $name = $attribute->getAttributeCode();

        // 2 - avoid yes/no selects to be multiselects
        if (is_array($options) && count($options) > 2) {
            $extra = 'multiple';
            $name .= '[]';
        } else {
            array_unshift($options, array('value' => '', 'label' => Mage::helper('catalogsearch')->__('All')));
        }

        return $this->_getSelectBlock()
            ->setName($name)
            ->setId($attribute->getAttributeCode())
            ->setTitle($this->getAttributeLabel($attribute))
            ->setExtraParams($extra)
            ->setValue($this->getAttributeValue($attribute))
            ->setOptions($options)
            ->setClass('form-control')
            ->getHtml();
    }

    /**
     * Retrieve yes/no element html for provided attribute
     *
     * @param Mage_Eav_Model_Entity_Attribute_Abstract $attribute
     * @return string
     */
    public function getAttributeYesNoElement($attribute)
    {
        $options = array(
            array('value' => '', 'label' => Mage::helper('catalogsearch')->__('All')),
            array('value' => '1', 'label' => Mage::helper('catalogsearch')->__('Yes')),
            array('value' => '0', 'label' => Mage::helper('catalogsearch')->__('No'))
        );

        $name = $attribute->getAttributeCode();
        return $this->_getSelectBlock()
            ->setName($name)
            ->setId($attribute->getAttributeCode())
            ->setTitle($this->getAttributeLabel($attribute))
            ->setExtraParams("")
            ->setValue($this->getAttributeValue($attribute))
            ->setOptions($options)
            ->setClass('form-control')
            ->getHtml();
    }
}
