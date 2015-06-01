jQuery(function ($) {

  if (window.Payment) {
    window.quoteBaseGrandTotal = $('#co-payment-form').data('quote-base-grand-total');
    window.checkQuoteBaseGrandTotal = window.quoteBaseGrandTotal;
    window.payment = new Payment('co-payment-form', $('#co-payment-form').data('save-url'));
    window.payment.currentMethod = $('#co-payment-form').data('current-method');
  }

  // Payment section in checkout page
  $('#btn_save_payment').click(function () {
    window.payment.save();
  });

  $('#checkout-payment-method-load').one('click', '#p_method_ccsave', function () {
    $('#payment_form_ccsave').card({
      // a selector or jQuery object for the container
      // where you want the card to appear
      container  : '#card_container', // *required*
      numberInput: '#ccsave_cc_number', // optional — default input[name="number"]
      expiryInput: '#ccsave_expiration, #ccsave_expiration_yr', // optional — default input[name="expiry"]
      cvcInput   : '#ccsave_cc_cid', // optional — default input[name="cvc"]
      nameInput  : '#ccsave_cc_owner', // optional - defaults input[name="name"]

      width     : 350, // optional — default 350px
      formatting: true, // optional - default true

      // Strings for translation - optional
      /*
       messages: {
       validDate: 'valid\ndate', // optional - default 'valid\nthru'
       monthYear: 'mm/yyyy', // optional - default 'month/year'
       },
       */

      // Default values for rendered fields - options
      values: {
        number: '•••• •••• •••• ••••',
        name  : 'Joe Bloggs',
        expiry: '••/••••',
        cvc   : '•••'
      }
    });
  });

  $('body').on('change', 'js-payment-method', function () {
    window.payment.switchMethod($(this).val());
  });

});
