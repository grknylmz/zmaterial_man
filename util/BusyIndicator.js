sap.ui.define(["sap/ui/base/Object"], function(UI5Object) {
  "use strict";

  return UI5Object.extend("gqsystema.zmaterial_man.util.BusyIndicator", {
    constructor: function() {},

    _hideBusyIndicator: function() {
      sap.ui.core.BusyIndicator.hide();
    },

    _showBusyIndicator: function(iDuration, iDelay) {
      sap.ui.core.BusyIndicator.show(iDelay);

      if (iDuration && iDuration > 0) {
        if (this._sTimeoutId) {
          jQuery.sap.clearDelayedCall(this._sTimeoutId);
          this._sTimeoutId = null;
        }

        this._sTimeoutId = jQuery.sap.delayedCall(iDuration, this, function() {
          this._hideBusyIndicator();
        });
      }
    },

    show: function() {
      this._showBusyIndicator(2000, 0);
    }
  });
});