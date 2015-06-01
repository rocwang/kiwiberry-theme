jQuery(function ($) {

  // Shipping address section in checkout page
  if (document.getElementById('co-shipping-form')) {
    $('#shipping-new-address-form [class^="customer-name"] input')
      .add('#shipping-new-address-form [class^="customer-name"] select')
      .add('#shipping\\:company')
      .add('[id^="shipping\\:street"]')
      .add('#shipping\\:city')
      .add('#shipping\\:postcode')
      .add('#shipping\\:telephone')
      .add('#shipping\\:fax')
      .add('#shipping\\:save_in_address_book')
      .change(function () {
        shipping.setSameAsBilling(false)
      });

    $('#shipping\\:same_as_billing').change(function () {
      shipping.setSameAsBilling(this.checked);
    });

    $('#shipping_btn_continue').click(function () {
      shipping.save();
    });

    window.shipping = new Shipping(
      'co-shipping-form',
      $('#co-shipping-form').data('address-url'),
      $('#co-shipping-form').data('save-url'),
      $('#co-shipping-form').data('methods-url')
    );

    window.shippingForm = new VarienForm('co-shipping-form');
    shippingForm.extraChildParams = ' onchange="shipping.setSameAsBilling(false);"';

    if (document.getElementById('shipping-address-select')) {
      shipping.newAddress(!$('#shipping-address-select').val());
    }
  }

});
