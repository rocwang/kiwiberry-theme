<?php

class VR_Kiwiberry_Block_ConfigurableSwatches_Catalog_Layer_State_Swatch extends Mage_ConfigurableSwatches_Block_Catalog_Layer_State_Swatch
{
    protected function _init($filter)
    {
        parent::_init($filter);
        $this->_initDone = false;
    }
}
