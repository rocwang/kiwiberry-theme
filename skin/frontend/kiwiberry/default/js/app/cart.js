jQuery(function ($) {

  // Coupon Form
  if (document.getElementById('discount-coupon-form')) {
    var discountForm = new VarienForm('discount-coupon-form');
    discountForm.submit = function (isRemove) {
      if (isRemove) {
        $('#coupon_code').removeClass('required-entry');
        $('#remove-coupon').val(1);
      } else {
        $('#coupon_code').addClass('required-entry');
        $('#remove-coupon').val(0);
      }
      return VarienForm.prototype.submit.bind(discountForm)();
    }

    $('#btn_coupon_apply').click(function () {
      discountForm.submit(false);
    });

    $('#btn_coupon_remove').click(function () {
      discountForm.submit(true);
    });
  }

  // Shipping Estimation
  if (document.getElementById('shipping-zip-form')) {

    var coShippingMethodForm = new VarienForm('shipping-zip-form');

    coShippingMethodForm.submit = function () {
      var country = $('#country').val();
      var optionalZip = false;

      for (var i = 0; i < window.optionalZipCountries.length; i++) {
        if (window.optionalZipCountries[i] == country) {
          optionalZip = true;
        }
      }

      if (optionalZip) {
        $('#postcode').removeClass('required-entry');
      }
      else {
        $('#postcode').addClass('required-entry');
      }

      return VarienForm.prototype.submit.bind(coShippingMethodForm)();
    }

    $('#btn_estimate_shipping').click(coShippingMethodForm.submit);

  }

});
