if (window.VarienForm) {
  VarienForm.prototype.initialize = function (formId, firstFieldFocus) {
    this.form = $(formId);
    if (!this.form) {
      return;
    }
    this.cache = $A();
    this.currLoader = false;
    this.currDataIndex = false;

    this.validator = new Validation(this.form, {
      onElementValidate: function (result, elm) {
        var container = jQuery(elm).closest('.form-group, .checkbox, .radio');

        if (result) {
          container.removeClass('has-error').addClass('has-success');
        } else {
          container.removeClass('has-success').addClass('has-error');
        }
      }
    });

    this.elementFocus = this.elementOnFocus.bindAsEventListener(this);
    this.elementBlur = this.elementOnBlur.bindAsEventListener(this);
    this.childLoader = this.onChangeChildLoad.bindAsEventListener(this);
    this.highlightClass = 'highlight';
    this.extraChildParams = '';
    this.firstFieldFocus = firstFieldFocus || false;
    this.bindElements();
    if (this.firstFieldFocus) {
      try {
        Form.Element.focus(Form.findFirstElement(this.form))
      }
      catch (e) {
      }
    }
  }
}

jQuery(function ($) {

  // Contact us page
  if (document.getElementById('contactForm')) {
    new VarienForm('contactForm', true);
  }

  // Login page
  if (document.getElementById('login-form')) {
    new VarienForm('login-form', true);
  }

  // Forgot password page
  if (document.getElementById('form-validate-forgot-password')) {
    new VarienForm('form-validate-forgot-password', true);
  }

  // Reset password page
  if (document.getElementById('form-validate-reset-password')) {
    new VarienForm('form-validate-reset-password', true);
  }

  // Advanced search page
  if (document.getElementById('form-validate-advanced-search')) {
    new VarienForm('form-validate-advanced-search', true);
  }

  // Reorder sidebar
  if (document.getElementById('reorder-validate-detail')) {
    new VarienForm('reorder-validate-detail');
  }

  // Orders and Returns page for guest
  if (document.getElementById('oar_widget_orders_and_returns_form')) {
    new VarienForm('oar_widget_orders_and_returns_form', true);
  }

  // Registration page
  if (document.getElementById('form-registration')) {
    new VarienForm('form-registration', true);
  }

  // Product review form validation
  if (document.getElementById('review-form')) {
    new VarienForm('review-form');
  }

  // My account information page
  if (document.getElementById('form-validate-account-info')) {
    new VarienForm('form-validate-account-info', true);
  }

  // New address page
  if (document.getElementById('form-validate-address-edit')) {
    new VarienForm('form-validate-address-edit', true);
  }

  // Share wishlist page
  if (document.getElementById('form-validate-share-wishlist')) {
    new VarienForm('form-validate-share-wishlist', true);
  }

  // My Newsletters page
  if (document.getElementById('form-validate-newsletter')) {
    new VarienForm('form-validate-newsletter', true);
  }

});
