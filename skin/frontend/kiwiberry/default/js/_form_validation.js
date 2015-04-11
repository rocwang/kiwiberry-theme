if (window.VarienForm) {

  VarienForm.prototype.initialize = function (formId, firstFieldFocus) {
    this.form = $(formId);
    if (!this.form) {
      return;
    }
    this.cache = $A();
    this.currLoader = false;
    this.currDataIndex = false;

    this.validator = new Validation(this.form, {onElementValidate : function(result, elm) {
      var container = jQuery(elm).closest('.form-group, .checkbox, .radio');

      if (result) {
        container.removeClass('has-error').addClass('has-success');
      } else {
        container.removeClass('has-success').addClass('has-error');
      }
    }});

    this.elementFocus = this.elementOnFocus.bindAsEventListener(this);
    this.elementBlur = this.elementOnBlur.bindAsEventListener(this);
    this.childLoader = this.onChangeChildLoad.bindAsEventListener(this);
    this.highlightClass = 'highlight';
    this.extraChildParams = '';
    this.firstFieldFocus = firstFieldFocus || false;
    this.bindElements();
    if (this.firstFieldFocus) {
      try {
        Form.Element.focus(Form.findFirstElement(this.form))
      }
      catch (e) {
      }
    }
  }

}

