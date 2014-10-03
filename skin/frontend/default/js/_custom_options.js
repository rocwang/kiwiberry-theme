var optionFileUpload = {
  productForm   : $('product_addtocart_form'),
  formAction    : '',
  formElements  : {},
  upload        : function (element) {
    this.formElements = this.productForm.select('input', 'select', 'textarea', 'button');
    this.removeRequire(element.readAttribute('id').sub('option_', ''));

    template = '<iframe id="upload_target" name="upload_target" style="width:0; height:0; border:0;"><\/iframe>';

    Element.insert($('option_' + element.readAttribute('id').sub('option_', '') + '_uploaded_file'), {after: template});

    this.formAction = this.productForm.action;

    var baseUrl = window.kiwiberryRegistry.fileUploadUrl;
    var urlExt = 'option_id/' + element.readAttribute('id').sub('option_', '');

    this.productForm.action = parseSidUrl(baseUrl, urlExt);
    this.productForm.target = 'upload_target';
    this.productForm.submit();
    this.productForm.target = '';
    this.productForm.action = this.formAction;
  },
  removeRequire : function (skipElementId) {
    for (var i = 0; i < this.formElements.length; i++) {
      if (this.formElements[i].readAttribute('id') != 'option_' + skipElementId + '_file' && this.formElements[i].type != 'button') {
        this.formElements[i].disabled = 'disabled';
      }
    }
  },
  addRequire    : function (skipElementId) {
    for (var i = 0; i < this.formElements.length; i++) {
      if (this.formElements[i].readAttribute('name') != 'options_' + skipElementId + '_file' && this.formElements[i].type != 'button') {
        this.formElements[i].disabled = '';
      }
    }
  },
  uploadCallback: function (data) {
    this.addRequire(data.optionId);
    $('upload_target').remove();

    if (data.error) {

    } else {
      $('option_' + data.optionId + '_uploaded_file').value = data.fileName;
      $('option_' + data.optionId + '_file').value = '';
      $('option_' + data.optionId + '_file').hide();
      $('option_' + data.optionId + '').hide();
      template = '<div id="option_' + data.optionId + '_file_box"><a href="#"><img src="var/options/' + data.fileName + '" alt=""><\/a><a href="#" onclick="optionFileUpload.removeFile(' + data.optionId + ')" title="Remove file" \/>Remove file<\/a>';

      Element.insert($('option_' + data.optionId + '_uploaded_file'), {after: template});
    }
  },
  removeFile    : function (optionId) {
    $('option_' + optionId + '_uploaded_file').value = '';
    $('option_' + optionId + '_file').show();
    $('option_' + optionId + '').show();

    $('option_' + optionId + '_file_box').remove();
  }
}

var optionTextCounter = {
  count: function (field, cntfield, maxlimit) {
    if (field.value.length > maxlimit) {
      field.value = field.value.substring(0, maxlimit);
    } else {
      cntfield.innerHTML = maxlimit - field.value.length;
    }
  }
}

if (typeof Product !== 'undefined') {

  Product.Options = Class.create();
  Product.Options.prototype = {
    initialize : function (config) {
      this.config = config;
      this.reloadPrice();
      document.observe("dom:loaded", this.reloadPrice.bind(this));
    },
    reloadPrice: function () {
      var config = this.config;
      var skipIds = [];
      $$('body .product-custom-option').each(function (element) {
        var optionId = 0;
        element.name.sub(/[0-9]+/, function (match) {
          optionId = parseInt(match[0], 10);
        });
        if (config[optionId]) {
          var configOptions = config[optionId];
          var curConfig = {price: 0};
          if (element.type == 'checkbox' || element.type == 'radio') {
            if (element.checked) {
              if (typeof configOptions[element.getValue()] != 'undefined') {
                curConfig = configOptions[element.getValue()];
              }
            }
          } else if (element.hasClassName('datetime-picker') && !skipIds.include(optionId)) {
            dateSelected = true;
            $$('.product-custom-option[id^="options_' + optionId + '"]').each(function (dt) {
              if (dt.getValue() == '') {
                dateSelected = false;
              }
            });
            if (dateSelected) {
              curConfig = configOptions;
              skipIds[optionId] = optionId;
            }
          } else if (element.type == 'select-one' || element.type == 'select-multiple') {
            if ('options' in element) {
              $A(element.options).each(function (selectOption) {
                if ('selected' in selectOption && selectOption.selected) {
                  if (typeof(configOptions[selectOption.value]) != 'undefined') {
                    curConfig = configOptions[selectOption.value];
                  }
                }
              });
            }
          } else {
            if (element.getValue().strip() != '') {
              curConfig = configOptions;
            }
          }
          if (element.type == 'select-multiple' && ('options' in element)) {
            $A(element.options).each(function (selectOption) {
              if (('selected' in selectOption) && typeof(configOptions[selectOption.value]) != 'undefined') {
                if (selectOption.selected) {
                  curConfig = configOptions[selectOption.value];
                } else {
                  curConfig = {price: 0};
                }
                optionsPrice.addCustomPrices(optionId + '-' + selectOption.value, curConfig);
                optionsPrice.reload();
              }
            });
          } else {
            optionsPrice.addCustomPrices(element.id || optionId, curConfig);
            optionsPrice.reload();
          }
        }
      });
    }
  }

}

function validateOptionsCallback(elmId, result) {
  var container = $(elmId).up('ul.options-list');
  if (result == 'failed') {
    container.removeClassName('validation-passed');
    container.addClassName('validation-failed');
  } else {
    container.removeClassName('validation-failed');
    container.addClassName('validation-passed');
  }
}
