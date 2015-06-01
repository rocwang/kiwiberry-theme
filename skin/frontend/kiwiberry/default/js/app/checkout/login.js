jQuery(function ($) {

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

});
