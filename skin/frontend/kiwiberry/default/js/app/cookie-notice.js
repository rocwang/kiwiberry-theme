jQuery(function ($) {

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

});
