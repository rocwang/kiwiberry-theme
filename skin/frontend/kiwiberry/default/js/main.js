jQuery(function ($) {
  // Search bar in navigation
  if (jQuery('#search_mini_form, #search, #search_autocomplete').length === 3) {
    var searchForm = new Varien.searchForm('search_mini_form', 'search', $('#search').attr('placeholder'));
    searchForm.initAutocomplete($('#search').data('suggest-url'), 'search_autocomplete');
  }

  // Go to the url when value changes, e.g.:
  // * Language select in navigation
  // * "Sort By" in category page
  // * "Results Per Page" in category page
  $('.js-change-location').change(function () {
    window.location.href = this.value;
  });

  // Request confirm before going to the link
  // e.g. when removing product compare item
  $('.js-confirm').click(function (e) {
    if (!confirm($(this).data('confirmation'))) {
      e.preventDefault();
    }
  });

  // Product add to cart form in product view page
  if (document.getElementById('product_addtocart_form')) {
    var productAddToCartForm = new VarienForm('product_addtocart_form');
    productAddToCartForm.submit = function (button, url) {
      if (this.validator.validate()) {
        var form = this.form;
        var oldUrl = form.action;

        if (url) {
          form.action = url;
        }
        var e = null;
        try {
          this.form.submit();
        } catch (e) {
        }
        this.form.action = oldUrl;
        if (e) {
          throw e;
        }

        if (button && button != 'undefined') {
          button.disabled = true;
        }
      }
    }.bind(productAddToCartForm);

    productAddToCartForm.submitLight = function (button, url) {
      if (this.validator) {
        var nv = Validation.methods;
        delete Validation.methods['required-entry'];
        delete Validation.methods['validate-one-required'];
        delete Validation.methods['validate-one-required-by-name'];
        // Remove custom datetime validators
        for (var methodName in Validation.methods) {
          if (methodName.match(/^validate-datetime-.*/i)) {
            delete Validation.methods[methodName];
          }
        }

        if (this.validator.validate()) {
          if (url) {
            this.form.action = url;
          }
          this.form.submit();
        }
        Object.extend(Validation.methods, nv);
      }
    }.bind(productAddToCartForm);
  }

  // Configurable product options
  if (document.getElementById('sp_config')) {
    window.spConfig = new Product.Config($('#sp_config').data('sp-config'));
  }

  // Option price
  if (document.getElementById('product_addtocart_form')) {
    window.optionsPrice = new Product.OptionsPrice($('#product_addtocart_form').data('options-price'));
  }

  // Product custom options
  if (document.getElementById('product_options')) {
    window.opConfig = new Product.Options($('#product_options').data('option-config'));
  }

  // "Add to Wishlist" in product page
  $('#add_to_wishlist').click(function (e) {
    e.preventDefault();
    productAddToCartForm.submitLight(this, this.href);
  });

  // "Add to Cart" in product page
  $('#add_to_cart').click(function () {
    productAddToCartForm.submit(this);
  });

  // Checkboxes of related products in product page
  var isAllRelatedSelected = false;
  $('#select-all-related').click(function (e) {
    e.preventDefault();

    isAllRelatedSelected = !isAllRelatedSelected;
    $('.js-related-checkbox').prop('checked', isAllRelatedSelected)
      .change();

  }).on('all-selected-changed', function () {
    $(this).html(
      (isAllRelatedSelected ? 'unselect' : 'select') + ' all'
    );
  });

  $('.js-related-checkbox').change(function () {
    var values = [];
    $('.js-related-checkbox:checked').each(function () {
      values.push(this.value);
    });
    $('#related-products-field').val(values.join(','));

    if ($('.js-related-checkbox:checked').length === 0) {
      isAllRelatedSelected = false;
      $('#select-all-related').trigger('all-selected-changed');
    } else if ($('.js-related-checkbox:checked').length === $('.js-related-checkbox').length) {
      isAllRelatedSelected = true;
      $('#select-all-related').trigger('all-selected-changed');
    }
  });

  // MSRP help link
  $('.js-msrp-help-link').each(function () {
    Catalog.Map.addHelpLink(this, $(this).attr('title'));
  });

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

    new RegionUpdater(
      'country',
      'region',
      'region_id',
      $('#shipping-zip-form').data('region-json')
    );

    $('#btn_estimate_shipping').click(coShippingMethodForm.submit);

  }

  // opcheckout_rwd.js
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
        progressDiv.find('.js-complete').removeClass('es-complete');

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

    window.billingRegionUpdater = new RegionUpdater(
      'billing:country_id',
      'billing:region',
      'billing:region_id',
      $('#co-billing-form').data('regions'),
      undefined,
      'billing:postcode'
    );

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
  if (document.getElementById('co-billing-form')) {
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

    window.shippingRegionUpdater = new RegionUpdater(
      'shipping:country_id',
      'shipping:region',
      'shipping:region_id',
      $('#co-shipping-form').data('regions'),
      undefined,
      'shipping:postcode'
    );
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
      values    : {
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

  // Contact us page
  if (document.getElementById('contactForm')) {
    var contactForm = new VarienForm('contactForm', true);
  }

  // Login page
  if (document.getElementById('login-form')) {
    var dataForm = new VarienForm('login-form', true);
  }

  // Logout successfully page
  var logoutRedirection = $('[data-logout-redirection]').data('logout-redirection');
  if (logoutRedirection) {
    setTimeout(function () {
      location.href = logoutRedirection;
    }, 5000);
  }

  // Registration page
  var registrationForm = document.getElementById('form-registration');
  if (registrationForm) {

    new VarienForm('form-registration', true);

    var regionJson = $(registrationForm).data('region-json');
    if (regionJson) {
      new RegionUpdater('country', 'region', 'region_id', regionJson, undefined, 'zip');
    }
  }

  // Forgot password page
  if (document.getElementById('form-validate-forgot-password')) {
    new VarienForm('form-validate-forgot-password', true);
  }

  // Reset password page
  if (document.getElementById('form-validate-reset-password')) {
    new VarienForm('form-validate-reset-password', true);
  }

  // Products comparison page
  $('.js-print').click(function () {
    window.print();
  });

  $('.js-close').click(function () {
    window.close();
  });

  $('.js-comparison-remove').click(function (e) {
    e.preventDefault();

    var column = $(this).closest('td').index() + 1;

    $.ajax($(this).attr('href'), {
      beforeSend: function () {
        $('#compare-list-please-wait').show();
      },
      data      : {isAjax: 1}
    }).done(function () {
      $('#compare-list-please-wait').hide();
      $('col, td', '#product_comparison').remove(':nth-child(' + column + ')');
    });
  });

  // Advanced search page
  if (document.getElementById('form-validate-advanced-search')) {
    var dataForm = new VarienForm('form-validate-advanced-search', true);
  }

  // Reorder sidebar
  if (document.getElementById('reorder-validate-detail')) {
    var reorderFormDetail = new VarienForm('reorder-validate-detail');

    $('.js-reorder-sidebar-checkbox', '#reorder-validate-detail')
      .prop('advaiceContainer', 'cart-sidebar-reorder-advice-container');
  }

  // Orders and Returns page for guest
  if (document.getElementById('oar_widget_orders_and_returns_form')) {
    var dataForm = new VarienForm('oar_widget_orders_and_returns_form', true);

    $('#quick_search_type_id').change(function () {
      if ($(this).val() === 'zip') {
        $('#oar-zip').show();
        $('#oar-email').hide();
      } else {
        $('#oar-zip').hide();
        $('#oar-email').show();
      }
    });
  }

  // My account information page
  if (document.getElementById('form-validate-account-info')) {
    var dataForm = new VarienForm('form-validate-account-info', true);

    $('#change_password').change(function () {
      if (this.checked) {
        $('#form-field-change-password').show();
        $('#current_password')
          .add('#password')
          .add('#confirmation')
          .addClass('required-entry');
      } else {
        $('#form-field-change-password').hide();
        $('#current_password')
          .add('#password')
          .add('#confirmation')
          .removeClass('required-entry');
      }
    });
  }

  // Address book page
  $('.js-delete-address').click(function (e) {
    e.preventDefault();

    swal({
      title             : 'Remove Address',
      text              : 'Are you sure you want to delete this address?',
      type              : "warning",
      allowOutsideClick : true,
      showCancelButton  : true,
      confirmButtonText : "Yes, delete it!.",
      confirmButtonColor: "#DD6B55"
    }, function () {
      window.location = $(e.currentTarget).attr('href');
    });
  });

  // New address page
  if (document.getElementById('form-validate-address-edit')) {
    var dataForm = new VarienForm('form-validate-address-edit', true);
    new RegionUpdater(
      'country',
      'region',
      'region_id',
      $('#form-validate-address-edit').data('regions'),
      undefined,
      'zip'
    );
  }

  // View order page
  $('.js-gift-message-link').click(function (e) {
    e.preventDefault();

    var giftMessageIdentifier = $(this).data('item-id');
    var link = $('#order-item-gift-message-link-' + giftMessageIdentifier);
    var container = $('#order-item-gift-message-' + giftMessageIdentifier);

    if (link.hasClass('js-expanded')) {
      link.removeClass('js-expanded');
      container.hide();
    } else {
      link.addClass('js-expanded');
      container.show();
    }
  });

  $('.js-btn-close-gift-msg').click(function (e) {
    e.preventDefault();
    giftMessageToogle($(this).data('item-id'));
  });

  // Print page
  if ($('body').hasClass('js-page-print')) {
    //window.print();
  }

  // Billing Agreement
  $('#btn-billing-agreement-cancel').click(function (e) {
    swal({
      title             : $(this).data('title'),
      text              : $(this).data('text'),
      type              : "warning",
      allowOutsideClick : true,
      showCancelButton  : true,
      confirmButtonText : "Yes, cancel it!.",
      confirmButtonColor: "#DD6B55"
    }, function () {
      window.location = $(e.currentTarget).data('url');
    });
  });

  // My Wishlist Page
  var wishlistForm = new Validation($('#wishlist-view-form').get(0));
  var wishlistAllCartForm = new Validation($('#wishlist-allcart-form').get(0));

  $('#btn-add-all-witems-to-cart').click(function () {
    // Calculate quantity
    var itemQtys = [];
    $('#wishlist-view-form .js-qty').each(function () {
        itemQtys[$(this).data('item-id')] = this.value;
      }
    );
    $('#qty').val(JSON.stringify(itemQtys));

    // Submit the form
    wishlistAllCartForm.form.submit();
  });

  $('.js-add-witem-to-cart').click(function () {
    var itemId = $(this).data('item-id');
    var url = $(this).data('url-add-to-cart');

    var qty = $('#wishlist-view-form .js-qty').filter('[data-item-id="' + itemId + '"]').get(0);
    if (qty) {
      var separator = (url.indexOf('?') >= 0) ? '&' : '?';
      url += separator + qty.name + '=' + encodeURIComponent(qty.value);
    }

    window.location = url;
  });

  $('.js-remove-witem').click(function (e) {

    e.preventDefault();

    swal({
      title             : $(this).attr('title'),
      text              : $(this).data('text'),
      type              : "warning",
      allowOutsideClick : true,
      showCancelButton  : true,
      confirmButtonText : "Yes, remove it!.",
      confirmButtonColor: "#DD6B55"
    }, function () {
      window.location = $(e.currentTarget).attr('href');
    });
  });

  // Share wishlist page
  Validation.addAllThese([[
    'validate-emails',
    'Please enter a valid email addresses, separated by commas. For example johndoe@domain.com, johnsmith@domain.com.',
    function (v) {
      if (Validation.get('IsEmpty').test(v)) {
        return true;
      }

      var valid_regexp = /^[a-z0-9\._-]{1,30}@([a-z0-9_-]{1,30}\.){1,5}[a-z]{2,4}$/i;
      var emails = v.split(',');

      for (var i = 0; i < emails.length; i++) {
        if (!valid_regexp.test(emails[i].strip())) {
          return false;
        }
      }

      return true;
    }
  ]]);

  if (document.getElementById('form-validate-share-wishlist')) {
    var dataForm = new VarienForm('form-validate-share-wishlist', true);
  }

  // My Applications
  $('.js-need-confirmation').click(function (e) {

    e.preventDefault();

    swal({
      title             : $(this).attr('title'),
      text              : $(this).data('confirmation'),
      type              : "warning",
      allowOutsideClick : true,
      showCancelButton  : true,
      confirmButtonText : "Yes",
      confirmButtonColor: "#DD6B55"
    }, function () {
      window.location = $(e.currentTarget).attr('href');
    });
  });

  // My Newsletters
  if (document.getElementById('form-validate-newsletter')) {
    var dataForm = new VarienForm('form-validate-newsletter', true);
  }

  // Add tag form in product view page
  var addTagFormJs = new VarienForm('addTagForm');
  $('#add-tag').click(function () {
    if (addTagFormJs.validator.validate()) {
      addTagFormJs.form.submit();
    }
  });

  // Poll
  $('#pollForm').submit(function (e) {
    if (!$(this).find('input[type="radio"]:checked').length) {
      e.preventDefault();
    }
  });

  // Captcha
  $('.js-captcha-img').each(function () {
    $(this).data(
      'captcha',
      new Captcha($(this).data('refresh-url'), this.id)
    );
  });

  $('.js-captcha-refresh').click(function (e) {
    e.preventDefault();

    var captchaId = $(this).attr('href');
    $(captchaId).data('captcha').refresh(this);
  });

  // Product review form validation
  if (document.getElementById('review-form')) {

    var dataForm = new VarienForm('review-form');

    Validation.addAllThese(
      [[
        'validate-rating',
        $('#review-form').data('rating-validation-msg'),
        function () {
          return $('#review-form input[type="radio"]:checked').length === 3;
        }
      ]]
    );
  }

  //<editor-fold desc="Configurable Swatches">

  // Configurable swatches for product list
  if (window.configurableMediaImagesData) {
    // Initialize configurable media images
    ConfigurableMediaImages.init(window.configurableMediaImagesData.imageType);

    for (productId in window.configurableMediaImagesData.imageFallback) {
      ConfigurableMediaImages.setImageFallback(productId, window.configurableMediaImagesData.imageFallback[productId]);
    }

    // Initialize configurable swatches list
    ConfigurableSwatchesList.init();
  }

  // Configurable swatches for product view
  if (window.spConfig) {
    var swatchesConfig = new Product.ConfigurableSwatches(window.spConfig);
  }
  //</editor-fold>

  // Cookie Notice
  $('#allow-save-cookie').click(function (e) {
    var button = $(this);
    var cookieName = button.data('cookie-name');
    Mage.Cookies.set(
      cookieName,
      JSON.stringify(button.data('cookie-value')),
      new Date(new Date().getTime() + button.data('cookie-expires') * 1000)
    );

    if (Mage.Cookies.get(cookieName)) {
      e.preventDefault();
      window.location.reload();
    }
  });

  // Tooltips
  $('[data-toggle="tooltip"]').tooltip();
  $('[data-toggle="popover"]').popover();

  // Mini Cart
  //truncateOptions();
  var minicartOptions = {
    formKey  : $('#cart-sidebar').data('formkey'),
    selectors: {
      itemRemove          : '#cart-sidebar .close',
      container           : '#navbar-mini-cart',
      inputQty            : '.js-cart-item-quantity',
      qty                 : '.js-minicart-count',
      overlay             : '.js-minicart-wrapper',
      error               : '#minicart-error-message',
      success             : '#minicart-success-message',
      quantityButtonPrefix: '#qbutton-',
      quantityInputPrefix : '#qinput-',
      quantityButtonClass : '.js-quantity-button'
    }
  }
  var Mini = new Minicart(minicartOptions);
  Mini.init();
})
;

