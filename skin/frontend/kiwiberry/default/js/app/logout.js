jQuery(function($) {

  // Logout successfully page
  var logoutRedirection = $('[data-logout-redirection]').data('logout-redirection');
  if (logoutRedirection) {
    setTimeout(function () {
      location.href = logoutRedirection;
    }, 5000);
  }

});
