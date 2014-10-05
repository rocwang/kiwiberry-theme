var kiwiberryRegistry = {};

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

  // Newsletter subscription
  if (document.getElementById('newsletter-validate-detail')) {
    new VarienForm('newsletter-validate-detail');
  }

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
  if (kiwiberryRegistry.spConfig) {
    window.spConfig = new Product.Config(window.kiwiberryRegistry.spConfig);
  }

  // Product custom options
  if (kiwiberryRegistry.opConfig) {
    window.opConfig = new Product.Options(window.kiwiberryRegistry.opConfig);
  }

  // Option price
  if (kiwiberryRegistry.optionPrice) {
    window.optionsPrice = new Product.OptionsPrice(kiwiberryRegistry.optionPrice);
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

      // Scroll viewport to top of checkout steps for smaller viewports
      if (Modernizr.mq('(max-width: ' + bp.xsmall + 'px)')) {
        $('html,body').animate({scrollTop: $('#checkoutSteps').offset().top}, 800);
      }

      if (!reloadProgressBlock) {
        this.resetPreviousSteps();
      }
    }
  }

  // One Page Checkout
  if (document.getElementById('checkoutSteps')) {

    var accordion = new Accordion('checkoutSteps', '.step-title', true);

    accordion.openSection($('#checkoutSteps').data('active-step'));

    var checkout = new Checkout(accordion, {
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

  // What's "Remember Me"
  $('.what-is-remember-me').popover();
});

