jQuery(function($) {

  // Orders and Returns page for guest
  if (document.getElementById('oar_widget_orders_and_returns_form')) {

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

});
