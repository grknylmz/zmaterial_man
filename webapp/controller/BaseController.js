sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/ui/core/routing/History"],
  function(Controller, History) {
    "use strict";
    return Controller.extend(
      "egqsystema.zmaterial_man.controller.BaseController",
      {
        getRouter: function() {
          return sap.ui.core.UIComponent.getRouterFor(this);
        },
        onNavBack: function() {
          var oHistory = History.getInstance();
          var sPreviousHash = oHistory.getPreviousHash();
          if (sPreviousHash !== undefined) {
            window.history.go(-1);
          } else {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("indexTiles", {}, true);
          }
        },
        getModel: function(name) {
          return (
            this.getView().getModel(name) ||
            this.getOwnerComponent().getModel(name)
          );
        },

        setModel: function(model, name) {
          return this.getView().setModel(model, name);
        },
        getEventBus: function() {
          return this.getOwnerComponent().getEventBus();
        },

        getResourceBundle: function() {
          return this.getOwnerComponent()
            .getModel("i18n")
            .getResourceBundle();
        },

        getListSelector: function() {
          return this.getOwnerComponent().listSelector;
        },

        getMessageManager: function() {
          return sap.ui.getCore().getMessageManager();
        },

        getMessageManagerUtils: function() {
          return this.getOwnerComponent()._messageManagerUtils;
        }
      }
    );
  }
);