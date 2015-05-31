jQuery(function ($) {

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

  // Add tag form in product view page
  var addTagFormJs = new VarienForm('addTagForm');
  $('#add-tag').click(function () {
    if (addTagFormJs.validator.validate()) {
      addTagFormJs.form.submit();
    }
  });

  // Product review form validation
  if (document.getElementById('review-form')) {
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

  // Configurable swatches for product view
  if (window.spConfig) {
    var swatchesConfig = new Product.ConfigurableSwatches(window.spConfig);
  }
});
