sap.ui.define(
  [
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "gqsystema/zmaterial_man/model/models",
    "gqsystema/zmaterial_man/util/Constants"
  ],
  function(UIComponent, Device, models, Constants) {
    "use strict";

    return UIComponent.extend("gqsystema.zmaterial_man.Component", {
      metadata: {
        manifest: "json"
      },

      /**
       * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
       * @public
       * @override
       */
      init: function() {
        // call the base component's init function
        UIComponent.prototype.init.apply(this, arguments);

        // enable routing
        this.getRouter().initialize();

        // set the device model
        this.setModel(models.createDeviceModel(), "device");
        this.setModel(models.createHelperModel(), Constants.HELPER_MODEL);

        var oInputModel = new sap.ui.model.json.JSONModel({
          materialNumber: "",
          busyIndicator: false
        });
        this.setModel(oInputModel, "inputModel");
      }
    });
  }
);
