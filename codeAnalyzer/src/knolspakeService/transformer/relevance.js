'use strict'

const endpoints = require(global.__base + 'knolspakeService/connector/endpoints.js');

module.exports = {
	request: function (data) {
		debugger
		data.url = endpoints.relevanceScore;
		return data;
	}, response: function() {

	} 
}