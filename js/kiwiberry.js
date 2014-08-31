jQuery(function ($) {
  // Search bar in navigation
  if (jQuery('#search_mini_form, #search, #search_autocomplete').length === 3) {
    var searchForm = new Varien.searchForm('search_mini_form', 'search', $('#search').attr('placeholder'));
    searchForm.initAutocomplete($('#search').data('suggest-url'), 'search_autocomplete');
  }

  // Language select in navigation
  $('#select-language').change(function () {
    window.location.href = this.value;
  })

  // Newsletter subscription
  if (document.getElementById('newsletter-validate-detail')) {
    var newsletterSubscriberFormDetail = new VarienForm('newsletter-validate-detail');
  }
});
