sap.ui.define(
  [
    "gqsystema/zmaterial_man/controller/BaseController",
    "gqsystema/zmaterial_man/util/BusyIndicator",
    "sap/m/MessageToast",
    "gqsystema/zmaterial_man/util/BackendService",
    "gqsystema/zmaterial_man/util/Constants"
  ],
  function(
    BaseController,
    BusyIndicator,
    MessageToast,
    BackendService,
    Constants
  ) {
    "use strict";
    var that;
    return BaseController.extend(
      "gqsystema.zmaterial_man.controller.MaterialDetail",
      {
        onInit: function() {
          that = this;

          that.backendService = new BackendService("materialModel");
        },
        onSearch: function() {
          var val = this.getView()
            .byId("scannedValue")
            .getProperty("value");
          if (val) {
            var oBusyIndicator = new BusyIndicator();
            oBusyIndicator.show();
            var reqUrl = Constants.MaterialSet + "('" + val + "')";
            that.backendService.readEntity(reqUrl, null, null);
          } else {
            var msg = this.getModel("i18n")
              .getResourceBundle()
              .getText("emptyMaterialNumber");
            MessageToast.show(msg);
          }
        },
        onScanForValue: function(oEvent) {
          if (!this._oScanDialog) {
            this._oScanDialog = new sap.m.Dialog({
              title: "Scan barcode",
              contentWidth: "640px",
              contentHeight: "480px",
              horizontalScrolling: false,
              verticalScrolling: false,
              stretchOnPhone: true,
              content: [
                new sap.ui.core.HTML({
                  id: this.createId("scanContainer"),
                  content: "<div />"
                })
              ],
              endButton: new sap.m.Button({
                text: "Cancel",
                press: function(oEvent) {
                  this._oScanDialog.close();
                }.bind(this)
              }),
              afterOpen: function() {
                this._initQuagga(
                  this.getView()
                    .byId("scanContainer")
                    .getDomRef()
                )
                  .done(function() {
                    // Initialisation done, start Quagga
                    Quagga.start();
                  })
                  .fail(
                    function(oError) {
                      MessageToast.error(
                        oError.message.length
                          ? oError.message
                          : "Failed to initialise Quagga with reason code " +
                              oError.name,
                        {
                          onClose: function() {
                            this._oScanDialog.close();
                          }.bind(this)
                        }
                      );
                    }.bind(this)
                  );
              }.bind(this),
              afterClose: function() {
                // Dialog closed, stop Quagga
                Quagga.stop();
              }
            });

            this.getView().addDependent(this._oScanDialog);
          }

          this._oScanDialog.open();
        },

        _initQuagga: function(oTarget) {
          var oDeferred = jQuery.Deferred();
          Quagga.init(
            {
              inputStream: {
                type: "LiveStream",
                target: oTarget,
                constraints: {
                  width: {
                    min: 640
                  },
                  height: {
                    min: 480
                  },
                  facingMode: "environment"
                }
              },
              locate: true,
              locator: {
                patchSize: "medium",
                halfSample: true
              },
              numOfWorkers: 2,
              frequency: 10,
              decoder: {
                readers: ["ean_13"],
                debug: {
                  drawBoundingBox: true,
                  showFrequency: true,
                  drawScanline: true,
                  showPattern: true
                }
              }
            },
            function(error) {
              if (error) {
                oDeferred.reject(error);
              } else {
                oDeferred.resolve();
              }
            }
          );

          if (!this._oQuaggaEventHandlersAttached) {
            // Attach event handlers...
            Quagga.onProcessed(
              function(result) {
                var drawingCtx = Quagga.canvas.ctx.overlay,
                  drawingCanvas = Quagga.canvas.dom.overlay;

                if (result) {
                  if (result.boxes) {
                    drawingCtx.clearRect(
                      0,
                      0,
                      parseInt(drawingCanvas.getAttribute("width")),
                      parseInt(drawingCanvas.getAttribute("height"))
                    );
                    result.boxes
                      .filter(function(box) {
                        return box !== result.box;
                      })
                      .forEach(function(box) {
                        Quagga.ImageDebug.drawPath(
                          box,
                          { x: 0, y: 1 },
                          drawingCtx,
                          { color: "green", lineWidth: 2 }
                        );
                      });
                  }

                  if (result.box) {
                    Quagga.ImageDebug.drawPath(
                      result.box,
                      { x: 0, y: 1 },
                      drawingCtx,
                      { color: "#00F", lineWidth: 2 }
                    );
                  }

                  if (result.codeResult && result.codeResult.code) {
                    Quagga.ImageDebug.drawPath(
                      result.line,
                      { x: "x", y: "y" },
                      drawingCtx,
                      { color: "red", lineWidth: 3 }
                    );
                  }
                }
              }.bind(this)
            );
            Quagga.onDetected(
              function(result) {
                // Barcode has been detected, value will be in result.codeResult.code. If requierd, validations can be done
                // on result.codeResult.code to ensure the correct format/type of barcode value has been picked up

                // Set barcode value in input field
                this.getView()
                  .byId("scannedValue")
                  .setValue(result.codeResult.code);

                // Close dialog
                this._oScanDialog.close();
              }.bind(this)
            );

            // Set flag so that event handlers are only attached once...
            this._oQuaggaEventHandlersAttached = true;
          }

          return oDeferred.promise();
        }
      }
    );
  }
);
