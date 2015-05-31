jQuery(function ($) {
  // Overwrite the Checkout object
  if (typeof Checkout !== 'undefined') {
    Checkout.prototype.gotoSection = function (section, reloadProgressBlock) {
      // Adds class so that the page can be styled to only show the "Checkout Method" step
      if ((this.currentStep == 'login' || this.currentStep == 'billing') && section == 'billing') {
        $('body').addClass('opc-has-progressed-from-login');
      }

      if (reloadProgressBlock) {
        this.reloadProgressBlock(this.currentStep);
      }
      this.currentStep = section;
      var sectionElement = $('#opc-' + section);
      sectionElement.addClass('allow');
      this.accordion.openSection('opc-' + section);

      // FIXME: Scroll viewport to top of checkout steps for smaller viewports
      //if (Modernizr.mq('(max-width: ' + bp.xsmall + 'px)')) {
      //  $('html,body').animate({scrollTop: $('#checkoutSteps').offset().top}, 800);
      //}

      if (!reloadProgressBlock) {
        this.resetPreviousSteps();
      }

      if (section === 'shipping_method') {
        resetShippingMethods();
      }

      if (section === 'review') {
        $('#checkout-review-load').trigger('review-loaded');
      }
    }

    Checkout.prototype.resetPreviousSteps = function () {
      var stepIndex = this.steps.indexOf(this.currentStep);

      //Clear other steps if already populated through javascript
      for (var i = stepIndex; i < this.steps.length; i++) {
        var progressDiv = $('#' + this.steps[i] + '-progress-opcheckout');

        //Remove "complete" status
        progressDiv.find('.js-complete').removeClass('js-complete');

        //Remove the "Change" button
        progressDiv.find('.js-btn-edit-opc').remove();

        //Remove the content
        progressDiv.find('.js-panel-body').remove();
      }
    }
  }

  // One Page Checkout
  if (document.getElementById('checkoutSteps')) {

    var accordion = new Accordion('checkoutSteps', '.step-title', true);

    accordion.openSection($('#checkoutSteps').data('active-step'));

    window.checkout = new Checkout(accordion, {
        progress  : $('#checkoutSteps').data('progress-url'),
        review    : $('#checkoutSteps').data('review-url'),
        saveMethod: $('#checkoutSteps').data('save-method-url'),
        failure   : $('#checkoutSteps').data('failure-url')
      }
    );

    // Login Section
    $('#onepage-guest-register-button').click(function () {
      checkout.setMethod();
    });

    var optionLogin = $('#login\\:register');
    if (optionLogin.data('force-register')) {
      optionLogin.prop('checked', true);
      checkout.setMethod();
    }

    // Login For in Login Section
    if (document.getElementById('login-form')) {
      var loginForm = new VarienForm('login-form', true);

      $('#login-email, #login-password').keypress(function (e) {
        if (e.which == 13) { // Press Enter to submit the login form.
          loginForm.submit();
        }
      });

      $('#btn-one-page-login').click(function () {
        if (loginForm.validator && loginForm.validator.validate()) {
          this.disabled = true;
          loginForm.submit();
        }
      });
    }
  }

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

  // Shipping address section in checkout page
  if (document.getElementById('co-shipping-form')) {
    $('#shipping-new-address-form [class^="customer-name"] input')
      .add('#shipping-new-address-form [class^="customer-name"] select')
      .add('#shipping\\:company')
      .add('[id^="shipping\\:street"]')
      .add('#shipping\\:city')
      .add('#shipping\\:postcode')
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

  // Back button in checkout page
  $('.js-opc-back').click(function () {
    checkout.back();
  });

  // Shipping methods section in checkout page
  if (document.getElementById('co-shipping-method-form')) {
    window.shippingMethod = new ShippingMethod(
      'co-shipping-method-form',
      $('#co-shipping-method-form').data('save-url')
    );

    $('#shipping_method_btn_continue').click(function () {
      shippingMethod.save();
    });
  }

  // Shipping method prices
  window.shippingCodePrice = {};

  function resetShippingMethods() {
    window.lastPrice = $('input[data-last-price]').data('last-price');

    $('input[type="radio"][name="shipping_method"]').each(function () {
      window.shippingCodePrice[$(this).val()] = $(this).data('price');
    });
  }

  $('#checkout-shipping-method-load').on(
    'click',
    'input[type="radio"][name="shipping_method"]',
    function () {
      if (this.checked == true) {

        if (typeof window.shippingCodePrice !== 'undefined') {
          var newPrice = window.shippingCodePrice[$(this).val()];

          if (!window.lastPrice) {
            window.lastPrice = newPrice;
            window.quoteBaseGrandTotal += newPrice;
          }

          if (newPrice != window.lastPrice) {
            window.quoteBaseGrandTotal += (newPrice - window.lastPrice);
            window.lastPrice = newPrice;
          }
        }

        window.checkQuoteBaseGrandTotal = window.quoteBaseGrandTotal;
      }
    });


  // Gift Message
  if ($('#dont_display_container').val() == 0) {

    if (!window.toogleVisibilityOnObjects) {

      window.toogleVisibilityOnObjects = function (source, objects) {

        source = $(source);
        objects = $(objects);

        if (source.get() && source.prop('checked')) {

          objects.show().find('.input-text').removeClass('validation-passed');

        } else {

          objects.hide();
          objects.find('.input-text').addClass('validation-passed');
          objects.find('.giftmessage-area').val('');
          objects.find('.checkbox').prop('checked', false);
          objects.find('.select').val('');
          objects.find('.price-box').addClass('no-display');

        }
      }
    }

    if (!window.toogleRequired) {

      window.toogleRequired = function (source, objects) {

        if (/^\s*$/.test($(source).val())) {

          $(objects).each(function () {
            if (typeof shippingMethod != 'undefined' && shippingMethod.validator) {
              shippingMethod.validator.reset(this);
            }
            $(this).removeClass('required-entry');
          });

        } else {

          $(objects).addClass('required-entry');

        }
      }
    }

    if (window.shipping) {

      shipping.onSave = function (evt) {
        new Ajax.Updater(
          'onepage-checkout-shipping-method-additional-load',
          $('#dont_display_container').data('additional-url'),
          {
            onSuccess  : function () {
              this.nextStep(evt);
            }.bind(this),
            evalScripts: true
          });
      }.bindAsEventListener(shipping);

      billing.onSave = function (evt) {
        new Ajax.Updater(
          'onepage-checkout-shipping-method-additional-load',
          $('#dont_display_container').data('additional-url'),
          {
            onSuccess  : function () {
              this.nextStep(evt);
            }.bind(this),
            evalScripts: true
          });
      }.bindAsEventListener(billing);

    }

    $('#onepage-checkout-shipping-method-additional-load').on('change', '#gift-message-whole-message', function () {
      toogleRequired('#gift-message-whole-message', '#gift-message-whole-from, #gift-message-whole-to');
    });

    $('#onepage-checkout-shipping-method-additional-load').on('change', '#allow-gift-messages-for-items-container .giftmessage-area', function () {
      toogleRequired(this, $(this).closest('.js-item').find('.input-text'));
    });

    $('#onepage-checkout-shipping-method-additional-load').on('change', '#allow_gift_messages', function () {
      toogleVisibilityOnObjects(this, '#allow-gift-message-container');
    });

    $('#onepage-checkout-shipping-method-additional-load').on('change', '#allow_gift_messages_for_order', function () {
      toogleVisibilityOnObjects(this, '#allow-gift-messages-for-order-container');
    });

    $('#onepage-checkout-shipping-method-additional-load').on('change', '#allow_gift_messages_for_items', function () {
      toogleVisibilityOnObjects(this, '#allow-gift-messages-for-items-container');
    });
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

  if (window.Payment) {
    window.quoteBaseGrandTotal = $('#co-payment-form').data('quote-base-grand-total');
    window.checkQuoteBaseGrandTotal = window.quoteBaseGrandTotal;
    window.payment = new Payment('co-payment-form', $('#co-payment-form').data('save-url'));
    window.payment.currentMethod = $('#co-payment-form').data('current-method');
  }


  // Order review section in checkout page
  $('#checkout-review-load').on('review-loaded', function () {
    truncateOptions();

    window.review = new Review(
      $('#checkout-review-table').data('save-url'),
      $('#checkout-review-table').data('success-url'),
      $('#checkout-agreements').get(0)
    );
  }).on('click', '#link-edit-cart', function (e) {
    e.preventDefault();

    swal({
      title             : $(this).data('title'),
      text              : $(this).data('text'),
      type              : "warning",
      allowOutsideClick : true,
      showCancelButton  : true,
      confirmButtonText : "Yes, go ahead.",
      confirmButtonColor: "#DD6B55"
    }, function () {
      window.location = $(e.currentTarget).attr('href');
    });
  }).on('click', '#btn-place-order', function () {
    window.review.save();
  });

  // Checkout progress
  $('#checkout-progress-wrapper').on('click', '.js-btn-edit-opc', function () {
    window.checkout.changeSection($(this).data('target'));
  });
});

