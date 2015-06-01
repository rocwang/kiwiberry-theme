jQuery(function($) {

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

  if (window.ShippingMethod) {
    var originalNextStep = ShippingMethod.prototype.nextStep;
    ShippingMethod.prototype.nextStep = function(transport) {
      originalNextStep.call(this, transport);
      payment.init();
    };
  }
});
