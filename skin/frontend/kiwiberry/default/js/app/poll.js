jQuery(function($) {

  // Poll
  $('#pollForm').submit(function (e) {
    if (!$(this).find('input[type="radio"]:checked').length) {
      e.preventDefault();
    }
  });

});
