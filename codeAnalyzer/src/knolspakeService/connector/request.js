'use strict'

const request = require('request');

module.exports = function (requestData, callback) {
	let search = {
		url: requestData.url,
		json: {
			"text": requestData.text,
			"topics": requestData.topics
		}, //Randomly generate or generate from a set of data
		headers: {
			"Content-Type": "application/json"
		},
		method: "POST"
	}
	request(search, function (err, response, body) {
		if (!err)
			callback(null, response, body);
	});
}