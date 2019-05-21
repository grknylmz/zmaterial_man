sap.ui.define([
	"sap/ui/base/Object"
], function(UI5Object) {
	"use strict";

	return UI5Object.extend("gqsystema.zmaterial_man.util.BackendService", {

		constructor: function(model) {
			this._model = model;
		},

		/**
		 *This is a generic method for reading entity set data from the backend.
		 * @param {String} entityName - the name of the entity of the set we want to retrieve from the backend
		 * @param {String} filter - a filter that might be necessary for the execution of the call
		 * @return {Object} - the result of the read method
		 */
		readEntity: function(entityName, filter, urlParameters) {
			return new Promise(function(resolve, reject) {
				var entitySet = entityName;
				this._model.read(entitySet, {
					urlParameters: urlParameters,
					filters: filter,
					success: function(data, response) {
						resolve(data, response);
					},
					error: function(error) {
						reject(error);
					}
				});
			}.bind(this));
		},

		/**
		 *This is a generic method for creating a new entry in an entity set
		 * @param {String} entitySet - the name of the entity for which we would like to create a new entry
		 * @param {Object} entryObject - the object that represents the metadata + the values for the new entry
		 * @return {Object} - the result of the create method
		 */
		createEntity: function(entitySet, entryObject) {
			return new Promise(function(resolve, reject) {
				this._model.create(entitySet, entryObject, {
					success: function(data, response) {
						resolve(data, response);
					},
					error: function(error) {
						reject(error);
					}
				});
			}.bind(this));
		}

	});
});