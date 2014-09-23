// Avoid `console` errors in browsers that lack a console.
(function() {
  var method;
  var noop = function () {};
  var methods = [
    'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
    'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
    'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
    'timeStamp', 'trace', 'warn'
  ];
  var length = methods.length;
  var console = (window.console = window.console || {});

  while (length--) {
    method = methods[length];

    // Only stub undefined methods.
    if (!console[method]) {
      console[method] = noop;
    }
  }
}());

// Place any jQuery/helper plugins in here.
jQuery(function ($) {
  $('.js-demo').each(function () {
    $(this)
      .after($('#code-template').html())
      .siblings('div').find('code').text(
        html_beautify(
          $(this).html(), {
            'indent_inner_html': false,
            'indent_size': 2,
            'indent_char': ' ',
            'wrap_line_length': 250,
            'brace_style': 'expand',
            'unformatted': ['del', 'mark', 'a', 'sub', 'sup', 'b', 'i', 'u'],
            'preserve_newlines': true,
            'max_preserve_newlines': 5,
            'indent_handlebars': false,
            'indent_scripts' : 'normal'
          })
      );
  });

});
