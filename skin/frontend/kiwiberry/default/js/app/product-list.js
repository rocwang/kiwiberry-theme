jQuery(function ($) {

  // Configurable swatches for product list
  if (window.configurableMediaImagesData) {
    // Initialize configurable media images
    ConfigurableMediaImages.init(window.configurableMediaImagesData.imageType);

    for (productId in window.configurableMediaImagesData.imageFallback) {
      ConfigurableMediaImages.setImageFallback(productId, window.configurableMediaImagesData.imageFallback[productId]);
    }

    // Initialize configurable swatches list
    ConfigurableSwatchesList.init();
  }

});
