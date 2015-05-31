jQuery(function ($) {

  // My account information page
  if (document.getElementById('form-validate-account-info')) {
    $('#change_password').change(function () {
      if (this.checked) {
        $('#form-field-change-password').show();
        $('#current_password')
          .add('#password')
          .add('#confirmation')
          .addClass('required-entry');
      } else {
        $('#form-field-change-password').hide();
        $('#current_password')
          .add('#password')
          .add('#confirmation')
          .removeClass('required-entry');
      }
    });
  }

  // Address book page
  $('.js-delete-address').click(function (e) {
    e.preventDefault();

    swal({
      title             : 'Remove Address',
      text              : 'Are you sure you want to delete this address?',
      type              : "warning",
      allowOutsideClick : true,
      showCancelButton  : true,
      confirmButtonText : "Yes, delete it!.",
      confirmButtonColor: "#DD6B55"
    }, function () {
      window.location = $(e.currentTarget).attr('href');
    });
  });

  // View order page
  $('.js-gift-message-link').click(function (e) {
    e.preventDefault();

    var giftMessageIdentifier = $(this).data('item-id');
    var link = $('#order-item-gift-message-link-' + giftMessageIdentifier);
    var container = $('#order-item-gift-message-' + giftMessageIdentifier);

    if (link.hasClass('js-expanded')) {
      link.removeClass('js-expanded');
      container.hide();
    } else {
      link.addClass('js-expanded');
      container.show();
    }
  });

  $('.js-btn-close-gift-msg').click(function (e) {
    e.preventDefault();
    giftMessageToogle($(this).data('item-id'));
  });

  // Billing Agreement
  $('#btn-billing-agreement-cancel').click(function (e) {
    swal({
      title             : $(this).data('title'),
      text              : $(this).data('text'),
      type              : "warning",
      allowOutsideClick : true,
      showCancelButton  : true,
      confirmButtonText : "Yes, cancel it!.",
      confirmButtonColor: "#DD6B55"
    }, function () {
      window.location = $(e.currentTarget).data('url');
    });
  });

  // My Wishlist Page
  var wishlistForm = new Validation($('#wishlist-view-form').get(0));
  var wishlistAllCartForm = new Validation($('#wishlist-allcart-form').get(0));

  $('#btn-add-all-witems-to-cart').click(function () {
    // Calculate quantity
    var itemQtys = [];
    $('#wishlist-view-form .js-qty').each(function () {
        itemQtys[$(this).data('item-id')] = this.value;
      }
    );
    $('#qty').val(JSON.stringify(itemQtys));

    // Submit the form
    wishlistAllCartForm.form.submit();
  });

  $('.js-add-witem-to-cart').click(function () {
    var itemId = $(this).data('item-id');
    var url = $(this).data('url-add-to-cart');

    var qty = $('#wishlist-view-form .js-qty').filter('[data-item-id="' + itemId + '"]').get(0);
    if (qty) {
      var separator = (url.indexOf('?') >= 0) ? '&' : '?';
      url += separator + qty.name + '=' + encodeURIComponent(qty.value);
    }

    window.location = url;
  });

  $('.js-remove-witem').click(function (e) {

    e.preventDefault();

    swal({
      title             : $(this).attr('title'),
      text              : $(this).data('text'),
      type              : "warning",
      allowOutsideClick : true,
      showCancelButton  : true,
      confirmButtonText : "Yes, remove it!.",
      confirmButtonColor: "#DD6B55"
    }, function () {
      window.location = $(e.currentTarget).attr('href');
    });
  });

  // Share wishlist page
  Validation.addAllThese([[
    'validate-emails',
    'Please enter a valid email addresses, separated by commas. For example johndoe@domain.com, johnsmith@domain.com.',
    function (v) {
      if (Validation.get('IsEmpty').test(v)) {
        return true;
      }

      var valid_regexp = /^[a-z0-9\._-]{1,30}@([a-z0-9_-]{1,30}\.){1,5}[a-z]{2,4}$/i;
      var emails = v.split(',');

      for (var i = 0; i < emails.length; i++) {
        if (!valid_regexp.test(emails[i].strip())) {
          return false;
        }
      }

      return true;
    }
  ]]);

  // My Applications
  $('.js-need-confirmation').click(function (e) {

    e.preventDefault();

    swal({
      title             : $(this).attr('title'),
      text              : $(this).data('confirmation'),
      type              : "warning",
      allowOutsideClick : true,
      showCancelButton  : true,
      confirmButtonText : "Yes",
      confirmButtonColor: "#DD6B55"
    }, function () {
      window.location = $(e.currentTarget).attr('href');
    });
  });

});
