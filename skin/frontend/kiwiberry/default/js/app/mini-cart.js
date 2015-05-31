jQuery(function ($) {

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
  };

  var Mini = new Minicart(minicartOptions);
  Mini.init();

});

