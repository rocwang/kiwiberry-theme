// ==============================================
// PDP - image zoom - needs to be available outside document.ready scope
// ==============================================

var ProductMediaManager = {
  IMAGE_ZOOM_THRESHOLD: 20,
  imageWrapper: null,

  destroyZoom: function() {
    $j('.zoomContainer').remove();
    $j('.product-image-gallery .gallery-image').removeData('elevateZoom');
  },

  createZoom: function(image) {
    // Destroy since zoom shouldn't be enabled under certain conditions
    ProductMediaManager.destroyZoom();

    if(
      // Don't use zoom on devices where touch has been used
    PointerManager.getPointer() == PointerManager.TOUCH_POINTER_TYPE
      // Don't use zoom when screen is small, or else zoom window shows outside body
    || Modernizr.mq("screen and (max-width:" + bp.medium + "px)")
    ) {
      return; // zoom not enabled
    }

    if(image.length <= 0) { //no image found
      return;
    }

    if(image[0].naturalWidth && image[0].naturalHeight) {
      var widthDiff = image[0].naturalWidth - image.width() - ProductMediaManager.IMAGE_ZOOM_THRESHOLD;
      var heightDiff = image[0].naturalHeight - image.height() - ProductMediaManager.IMAGE_ZOOM_THRESHOLD;

      if(widthDiff < 0 && heightDiff < 0) {
        //image not big enough

        image.parents('.product-image').removeClass('zoom-available');

        return;
      } else {
        image.parents('.product-image').addClass('zoom-available');
      }
    }

    image.elevateZoom();
  },

  swapImage: function(targetImage) {
    targetImage = $j(targetImage);
    targetImage.addClass('gallery-image');

    // Fixme: Disable zoom temporarily
    //ProductMediaManager.destroyZoom();

    var imageGallery = $j('#product-gallery-images');

    if(targetImage[0].complete) { //image already loaded -- swap immediately
      imageGallery.find('.item').removeClass('active');

      //move target image to correct place, in case it's necessary
      var item = $j('<div class="item active"></div>').append(targetImage);
      imageGallery.append(item);

      // Fixme: Disable zoom temporarily
      //wire zoom on new image
      //ProductMediaManager.createZoom(targetImage);

    } else { //need to wait for image to load

      //add spinner
      imageGallery.addClass('loading');

      //move target image to correct place, in case it's necessary
      var item = $j('<div class="item"></div>').append(targetImage);
      imageGallery.append(item);

      //wait until image is loaded
      imagesLoaded(targetImage, function() {
        //remove spinner
        imageGallery.removeClass('loading');

        //hide old image
        imageGallery.find('.item').removeClass('active');

        //reveal new image
        item.addClass('active');

        // Fixme: Disable zoom temporarily
        //wire zoom on new image
        //ProductMediaManager.createZoom(targetImage);
      });

    }
  },

  wireThumbnails: function() {
    //trigger image change event on thumbnail click
    $j('.product-image-thumbs .thumb-link').click(function(e) {
      e.preventDefault();
      var jlink = $j(this);
      var target = $j('#image-' + jlink.data('image-index'));

      ProductMediaManager.swapImage(target);
    });
  },

  initZoom: function() {
    ProductMediaManager.createZoom($j(".gallery-image.visible")); //set zoom on first image
  },

  init: function() {
    ProductMediaManager.imageWrapper = $j('.product-img-box');

    // Re-initialize zoom on viewport size change since resizing causes problems with zoom and since smaller
    // viewport sizes shouldn't have zoom
    $j(window).on('delayed-resize', function(e, resizeEvent) {
      ProductMediaManager.initZoom();
    });

    ProductMediaManager.initZoom();

    ProductMediaManager.wireThumbnails();

    $j(document).trigger('product-media-loaded', ProductMediaManager);
  }
};
