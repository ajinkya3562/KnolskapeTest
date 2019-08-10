'use strict'

const endpoints = require(global.__base + 'knolspakeService/connector/endpoints.js');

module.exports = {
	request: function (data, callback) {
		data.url = endpoints.grammarScore;
		return data;
	}, response: function() {

	} 
}