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
  $('.js-msrp-help-link').each(function() {
    Catalog.Map.addHelpLink(this, $(this).attr('title'));
  });
});

