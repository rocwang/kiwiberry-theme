jQuery(function ($) {

  // Go to the url when value changes, e.g.:
  // * Language select in navigation
  // * "Sort By" in category page
  // * "Results Per Page" in category page
  $('.js-change-location').change(function () {
    window.location.href = this.value;
  });

  // Request confirm before going to the link
  // e.g. when removing product compare item
  $('.js-confirm').click(function (e) {
    if (!confirm($(this).data('confirmation'))) {
      e.preventDefault();
    }
  });

  // Expand tax details in totals
  $('body').on('click', '.js-toggle-tax-details', function (e) {
    e.preventDefault();
    $($(this).data('target')).toggleClass('is-visiable');
  });

  // Tooltips
  $('[data-toggle="tooltip"]').tooltip();

  // Pop Over
  $('[data-toggle="popover"]').popover();

  //<editor-fold desc="Captcha">
  $('.js-captcha-img').each(function () {
    $(this).data(
      'captcha',
      new Captcha($(this).data('refresh-url'), this.id)
    );
  });

  $('.js-captcha-refresh').click(function (e) {
    e.preventDefault();

    var captchaId = $(this).attr('href');
    $(captchaId).data('captcha').refresh(this);
  });
  //</editor-fold>

});
