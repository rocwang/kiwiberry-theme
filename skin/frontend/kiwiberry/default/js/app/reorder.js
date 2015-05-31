jQuery(function ($) {

  // Reorder sidebar
  if (document.getElementById('reorder-validate-detail')) {
    $('.js-reorder-sidebar-checkbox', '#reorder-validate-detail')
      .prop('adviceContainer', 'cart-sidebar-reorder-advice-container');
  }

});
