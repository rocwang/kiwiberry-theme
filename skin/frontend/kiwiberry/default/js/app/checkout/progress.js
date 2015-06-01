jQuery(function ($) {

  // Checkout progress
  $('#opc-block-progress').on('click', '.js-link-edit-opc', function (e) {
    e.preventDefault();
    window.checkout.changeSection($(this).data('target'));
  });

});
