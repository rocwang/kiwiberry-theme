// Products comparison page
jQuery(function($) {

  $('.js-print').click(function () {
    window.print();
  });

  $('.js-close').click(function () {
    window.close();
  });

  $('.js-comparison-remove').click(function (e) {
    e.preventDefault();

    var column = $(this).closest('td').index() + 1;

    $.ajax($(this).attr('href'), {
      beforeSend: function () {
        $('#compare-list-please-wait').show();
      },
      data      : {isAjax: 1}
    }).done(function () {
      $('#compare-list-please-wait').hide();
      $('col, td', '#product_comparison').remove(':nth-child(' + column + ')');
    });
  });

});

