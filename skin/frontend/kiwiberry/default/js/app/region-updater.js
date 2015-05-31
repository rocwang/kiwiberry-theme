jQuery(function ($) {

  // Region Updater for:
  // * Registration page
  // * Shipping Estimation in cart page
  // * New address page
  $('#form-registration, #shipping-zip-form, #form-validate-address-edit').each(function () {
    var regionJson = $(this).data('regions');
    if (regionJson) {
      new RegionUpdater('country', 'region', 'region_id', regionJson, undefined, 'zip');
    }
  });

  // Billing section in checkout page
  var billingRegionJson = $('#co-billing-form').data('regions');
  if (billingRegionJson) {
    window.billingRegionUpdater = new RegionUpdater(
      'billing:country_id',
      'billing:region',
      'billing:region_id',
      billingRegionJson,
      undefined,
      'billing:postcode'
    );
  }

  // Shipping address section in checkout page
  var shippingRegionJson = $('#co-shipping-form').data('regions');
  if (shippingRegionJson) {
    window.shippingRegionUpdater = new RegionUpdater(
      'shipping:country_id',
      'shipping:region',
      'shipping:region_id',
      shippingRegionJson,
      undefined,
      'shipping:postcode'
    );
  }

});
