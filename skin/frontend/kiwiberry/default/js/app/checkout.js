jQuery(function ($) {

  // Overwrite the Checkout object (opcheckout_rwd.js)
  if (typeof Checkout !== 'undefined') {
    Checkout.prototype.gotoSection = function (section, reloadProgressBlock) {
      // Adds class so that the page can be styled to only show the "Checkout Method" step
      if ((this.currentStep == 'login' || this.currentStep == 'billing') && section == 'billing') {
        $('body').addClass('opc-has-progressed-from-login');
      }

      if (reloadProgressBlock) {
        this.reloadProgressBlock(this.currentStep);
      }
      this.currentStep = section;
      var sectionElement = $('#opc-' + section);
      sectionElement.addClass('allow');
      this.accordion.openSection('opc-' + section);

      // FIXME: Scroll viewport to top of checkout steps for smaller viewports
      //if (Modernizr.mq('(max-width: ' + bp.xsmall + 'px)')) {
      //  $('html,body').animate({scrollTop: $('#checkoutSteps').offset().top}, 800);
      //}

      if (!reloadProgressBlock) {
        this.resetPreviousSteps();
      }

      // Custom code by Roc
      if (section === 'shipping_method') {
        window.lastPrice = $('input[data-last-price]').data('last-price');

        $('input[type="radio"][name="shipping_method"]').each(function () {
          window.shippingCodePrice[$(this).val()] = $(this).data('price');
        });
      }

      // Custom code by Roc
      if (section === 'review') {
        $('#checkout-review-load').trigger('review-loaded');
      }
    };

    Checkout.prototype.resetPreviousSteps = function () {
      var stepIndex = this.steps.indexOf(this.currentStep);

      //Clear other steps if already populated through javascript
      for (var i = stepIndex; i < this.steps.length; i++) {
        var progressDiv = $('#' + this.steps[i] + '-progress-opcheckout');

        //Remove "complete" status
        progressDiv.find('.is-completed').removeClass('is-completed');

        //Remove the "Change" button
        progressDiv.find('.js-link-edit-opc').remove();

        //Remove the content
        progressDiv.find('.js-panel-body').remove();
      }
    };
  }

  // One Page Checkout
  if (document.getElementById('checkoutSteps')) {

    var accordion = new Accordion('checkoutSteps', '.step-title', true);

    accordion.openSection($('#checkoutSteps').data('active-step'));

    window.checkout = new Checkout(accordion, {
        progress  : $('#checkoutSteps').data('progress-url'),
        review    : $('#checkoutSteps').data('review-url'),
        saveMethod: $('#checkoutSteps').data('save-method-url'),
        failure   : $('#checkoutSteps').data('failure-url')
      }
    );
  }

  // Back button in checkout page
  $('.js-opc-back').click(function () {
    checkout.back();
  });

});

