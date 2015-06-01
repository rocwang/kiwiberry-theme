jQuery(function($) {

  // Order review section in checkout page
  $('#checkout-review-load').on('review-loaded', function () {
    truncateOptions();

    window.review = new Review(
      $('#checkout-review-table').data('save-url'),
      $('#checkout-review-table').data('success-url'),
      $('#checkout-agreements').get(0)
    );
  }).on('click', '#link-edit-cart', function (e) {
    e.preventDefault();

    swal({
      title             : $(this).data('title'),
      text              : $(this).data('text'),
      type              : "warning",
      allowOutsideClick : true,
      showCancelButton  : true,
      confirmButtonText : "Yes, go ahead.",
      confirmButtonColor: "#DD6B55"
    }, function () {
      window.location = $(e.currentTarget).attr('href');
    });
  }).on('click', '#btn-place-order', function () {
    window.review.save();
  });

});
