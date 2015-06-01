if (Validation) {
  Validation.defaultOptions.onElementValidate = function (result, elm) {
    var $this = jQuery(elm);
    var container = $this.closest('.form-group, .checkbox, .radio');

    if (result) {

      container.removeClass('has-error').addClass('has-success');

      if ($this.is('input.form-control')) {
        container.addClass('has-feedback')
          .find('.js-feedback-icon').remove()
          .end().append(
          '<span class="glyphicon glyphicon-ok form-control-feedback js-feedback-icon" aria-hidden="true"></span>'
          + '<span class="sr-only js-feedback-icon">(success)</span>'
        );
      }

    } else {

      container.removeClass('has-success').addClass('has-error');

      if ($this.is('input.form-control')) {
        container.addClass('has-feedback')
          .find('.js-feedback-icon').remove()
          .end().append(
          '<span class="glyphicon glyphicon-remove form-control-feedback js-feedback-icon" aria-hidden="true"></span>'
          + '<span class="sr-only js-feedback-icon">(error)</span>'
        );
      }

    }
  };
}

jQuery(function ($) {

  // Form validation used in:
  // * Contact us page
  // * Login page
  // * Registration page
  // * Forgot password page
  // * Reset password page
  // * Advanced search page
  // * Reorder sidebar
  // * Orders and Returns page for guest
  // * Product review form
  // * My account information page
  // * New address page
  // * Share wishlist page
  // * My Newsletters page
  $('.js-validate-form').each(function () {
    new VarienForm(this, true);
  });

});
