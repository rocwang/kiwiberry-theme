var $j = jQuery.noConflict();
;(function($) {
    'use strict';

    function Site(settings) {

        this.windowLoaded = false;

    }

    Site.prototype = {
        constructor: Site,

        start: function() {
            var me = this;

            $(window).load(function() {
                me.windowLoaded = true;
            });

            this.attach();
        },

        attach: function() {
            //this.attachBootstrapPrototypeCompatibility();
            this.attachMedia();
        },

        attachBootstrapPrototypeCompatibility: function() {

            // Bootstrap and Prototype don't play nice, in the sense that
            // prototype is a really wacky horrible library. It'll
            // hard-code CSS to hide an element when a hide() event
            // is fired. See http://stackoverflow.com/q/19139063
            // To overcome this with dropdowns that are both
            // toggle style and hover style, we'll add a CSS
            // class which has "display: block !important"
            $('*').on('show.bs.dropdown show.bs.collapse', function(e) {
                $(e.target).addClass('bs-prototype-override');
            });

            $('*').on('hidden.bs.collapse', function(e) {
                $(e.target).removeClass('bs-prototype-override');
            });
        },

        attachMedia: function() {
            var $links = $('[data-toggle="media"]');
            if ( ! $links.length) return;

            // When somebody clicks on a link, slide the
            // carousel to the slide which matches the
            // image index and show the modal
            $links.on('click', function(e) {
                e.preventDefault();

                var $link = $(this),
                   $modal = $($link.attr('href')),
                $carousel = $modal.find('.carousel'),
                    index = parseInt($link.data('index'));

                $carousel.carousel(index);
                $modal.modal('show');

                return false;
            });
        }
    };

    jQuery(document).ready(function($) {
        var site = new Site();
        site.start();
    });

})(jQuery);

// Fix the tricky conflict between Prototype and jQuery,
// which cause bugs when hiding various Bootstrap components.
// See: http://stackoverflow.com/a/20748540/2336096
(function() {
  var isBootstrapEvent = false;
  if (window.jQuery) {
    var all = jQuery('*');
    jQuery.each([
      'hide.bs.dropdown',
      'hide.bs.collapse',
      'hide.bs.modal',
      'hide.bs.tooltip',
      'hide.bs.popover'
    ], function(index, eventName) {
      all.on(eventName, function( event ) {
        isBootstrapEvent = true;
      });
    });
  }
  var originalHide = Element.hide;
  Element.addMethods({
    hide: function(element) {
      if(isBootstrapEvent) {
        isBootstrapEvent = false;
        return element;
      }
      return originalHide(element);
    }
  });
})();

// Fix position issue for iOS when virtual keyborad on.
jQuery(function($) {
  // iOS check...ugly but necessary
  if( navigator.userAgent.match(/iPhone|iPad|iPod/i) ) {

    var  scrollTop;

    $('.modal').on('show.bs.modal', function() {
      // Position backdrop absolute and make it span the entire page
      //
      // Also dirty, but we need to tap into the backdrop after Boostrap
      // positions it but before transitions finish.
      //
      setTimeout( function() {
        $('.modal-backdrop').css({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: Math.max(
            document.body.scrollHeight, document.documentElement.scrollHeight,
            document.body.offsetHeight, document.documentElement.offsetHeight,
            document.body.clientHeight, document.documentElement.clientHeight
          ) + 'px'
        });
      }, 0);

    }).on('focus', 'input', function() {
      scrollTop = $(window).scrollTop();
    }) .on('blur', 'input', function() {
      $(window).scrollTop(scrollTop);
    });

  }
});
