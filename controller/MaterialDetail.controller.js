sap.ui.define(
	[
		"gqsystema/zmaterial_man/controller/BaseController",
		"sap/m/MessageToast",
		"gqsystema/zmaterial_man/util/BackendService",
		"gqsystema/zmaterial_man/util/Constants",
		"sap/ndc/BarcodeScanner"
	],
	function(BaseController, MessageToast, BackendService, Constants, BarcodeScanner) {
		"use strict";
		var that, _dialog;
		return BaseController.extend(
			"gqsystema.zmaterial_man.controller.MaterialDetail", {
				onInit: function() {
					that = this;
					that.createDialog();
					that.matModel = this.getModel();
					that.backendService = new BackendService(that.matModel);
				},
				createDialog: function() {
					if (!that._dialog) {
						that._dialog = sap.ui.xmlfragment(
							"gqsystema.zmaterial_man.fragment.BusyDialog",
							that
						);
						that.getView().addDependent(that._dialog);
					}
				},

				onSearch: function() {
					var bindingLayout = this.byId("bindingLayout");

					var errMsg = this.getModel("i18n")
						.getResourceBundle()
						.getText("connectionError");

					var val = this.getView()
						.byId("scannedValue")
						.getProperty("value");

					if (val) {
						that._dialog.open();
						var reqUrl = Constants.MATERIAL_SET + "('" + val + "')";
						var metadata = that.matModel.getServiceMetadata();
						if (metadata === undefined) {
							that._dialog.close();
							MessageToast.show(errMsg);
							return;
						} else {
							that.matModel.read(reqUrl, {
								urlParameters: null,
								filters: null,
								success: function(data) {
									that.data = data;
									bindingLayout.bindElement(reqUrl);
									that._dialog.close();
									return;
								},
								error: function(error) {
									that._dialog.close();
									errMsg = that.getModel("i18n")
										.getResourceBundle()
										.getText("materialError");
									MessageToast.show(errMsg);
									return;
								}
							});
						}
					} else {
						var msg = this.getModel("i18n")
							.getResourceBundle()
							.getText("emptyMaterialNumber");
						MessageToast.show(msg);
					}
				},
				onScanForValue: function() {
					var currView = this.getView();
					BarcodeScanner.scan(
						function(mResult) {
							var textBox = currView.byId("scannedValue");
							textBox.setValue(mResult.text);
						},
						function() {
							MessageToast.show('Error');
						}
					);
				}
			}
		);
	});
