jQuery(function ($) {
  // Search bar in navigation
  if (jQuery('#search_mini_form, #search, #search_autocomplete').length === 3) {
    var searchForm = new Varien.searchForm('search_mini_form', 'search', $('#search').attr('placeholder'));
    searchForm.initAutocomplete($('#search').data('suggest-url'), 'search_autocomplete');
  }

  // Go to the url when value changes, e.g.:
  // * Language select in navigation
  // * "Sort By" in category page
  // * "Results Per Page" in category page
  $('.js-change-location').change(function() {
    window.location.href = this.value;
  });

  // Newsletter subscription
  if (document.getElementById('newsletter-validate-detail')) {
    new VarienForm('newsletter-validate-detail');
  }

  // Request confirm before going to the link
  // e.g. when removing product compare item
  $('.js-confirm').click(function(e) {
    if (!confirm($(this).data('confirmation'))) {
      e.preventDefault();
    }
  });
});
