var $j = jQuery.noConflict();

// Fix the tricky conflict between Prototype and jQuery,
// which cause bugs when hiding various Bootstrap components.
// See: http://stackoverflow.com/a/20748540/2336096
(function () {

  var isBootstrapEvent = false;

  if (window.jQuery) {
    jQuery.each([
      'hide.bs.dropdown',
      'hide.bs.collapse',
      'hide.bs.modal',
      'hide.bs.tooltip',
      'hide.bs.tab',
      'hide.bs.popover'
    ], function (index, eventName) {
      jQuery('*').on(eventName, function (event) {
        isBootstrapEvent = true;
      });
    });
  }

  var originalHide = Element.hide;
  Element.addMethods({
    hide: function (element) {
      if (isBootstrapEvent) {
        isBootstrapEvent = false;
        return element;
      }
      return originalHide(element);
    }
  });

})();
