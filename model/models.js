sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function(JSONModel, Device) {
	"use strict";

	return {

		createDeviceModel: function() {
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},
		createHelperModel: function() {
			var helper = {
				isLoading: false
			};
			var oModel = new JSONModel(helper);
			oModel.setDefaultBindingMode("TwoWay");
			return oModel;
		}
	};
});