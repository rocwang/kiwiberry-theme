jQuery(function ($) {

  if (document.getElementById('customer-dob')) {
    var customer_dob = new Varien.DOB(
      '#customer-dob',
      $('#customer-dob').data('is-required'),
      $('#customer-dob').data('date-format')
    );
  }

  // Button "Save in address book" in checkout page
  $('#billing\\:save_in_address_book').change(function () {
    if (window.shipping) shipping.setSameAsBilling(false);
  });

  // Button "Ship to this address" in checkout page
  $('#billing\\:use_for_shipping_yes').click(function () {
    $('#shipping\\:same_as_billing').prop('checked', true);
  });

  // Button "Ship to different address" in checkout page
  $('#billing\\:use_for_shipping_no').click(function () {
    $('#shipping\\:same_as_billing').prop('checked', false);
  });

  // Billing section in checkout page
  if (document.getElementById('co-billing-form')) {

    window.billing = new Billing(
      'co-billing-form',
      $('#co-billing-form').data('address-url'),
      $('#co-billing-form').data('save-url')
    );
    window.billingForm = new VarienForm('co-billing-form');

    if (document.getElementById('billing-address-select')) {
      billing.newAddress(!$('#billing-address-select').val());
    }

    if (document.getElementById('onepage-guest-register-button')) {

      $('#onepage-guest-register-button').click(function () {

        window.billingRememberMe = $('#co-billing-form .remember-me-box');
        if (billingRememberMe.length > 0) {

          if ($('#login\\:guest').length > 0 && $('#login\\:guest').prop('checked')) {

            billingRememberMe.hide();

          } else if ($('#login\\:register').length > 0
            && ($('#login\\:register').prop('checked') || $('#login\\:register').prop('type') === 'hidden')
          ) {

            billingRememberMe.show();

          }
        }

      });

    }

    $('#billing-button').click(function () {
      billing.save();
    });

  }

});
