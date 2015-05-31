jQuery(function ($) {

  var regionJson;

  // Registration page
  regionJson = $('#form-registration').data('region-json');
  if (regionJson) {
    new RegionUpdater('country', 'region', 'region_id', regionJson, undefined, 'zip');
  }

  // Shipping Estimation in cart page
  regionJson = $('#shipping-zip-form').data('region-json');
  if (regionJson) {
    new RegionUpdater('country', 'region', 'region_id', regionJson);
  }

  // New address page
  regionJson = $('#form-validate-address-edit').data('regions');
  if (regionJson) {
    new RegionUpdater('country', 'region', 'region_id', regionJson, undefined, 'zip');
  }

  // Billing section in checkout page
  regionJson = $('#co-billing-form').data('regions');
  if (regionJson) {
    window.billingRegionUpdater = new RegionUpdater(
      'billing:country_id',
      'billing:region',
      'billing:region_id',
      regionJson,
      undefined,
      'billing:postcode'
    );
  }

  // Shipping address section in checkout page
  regionJson = $('#co-shipping-form').data('regions');
  if (regionJson) {
    window.shippingRegionUpdater = new RegionUpdater(
      'shipping:country_id',
      'shipping:region',
      'shipping:region_id',
      regionJson,
      undefined,
      'shipping:postcode'
    );
  }

});
