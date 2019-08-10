'use strict'

const async = require('async');
const relevanceTransformer = require(global.__base + 'knolspakeService/transformer').relevance;
const spellingTransformer = require(global.__base + 'knolspakeService/transformer').spelling;
const grammarTransformer = require(global.__base + 'knolspakeService/transformer').grammar;
const requestKnolspake = require(global.__base + 'knolspakeService/connector/request.js');

module.exports = function (req, res, callback) {
	let score = {};
	async.waterfall([function(waterfallCb) {
		let relevanceData = relevanceTransformer.request({text: req.body.text, topics: req.body.topics});
		
		requestKnolspake(relevanceData, function (err, res, body) {
			if (err)
				req.logger.error({error: err}, "error occured while relevance api");
			else 
				score.relevanceScore = body.score; 
			waterfallCb(err, score);
		});
	}, function (wfData, waterfallCb) {
		let spellingData = spellingTransformer.request({text: req.body.text});
		
		requestKnolspake(spellingData, function (err, res, body) {
			if (err)
				req.logger.error({error: err}, "error occured while spelling api");
			else 
				score.spellingScore = body.score; 
			waterfallCb(err, score);
		});
	}, function (wfData, waterfallCb) {
		let grammarData = grammarTransformer.request({text: req.body.text});
		
		requestKnolspake(grammarData, function (err, res, body) {
			if (err)
				req.logger.error({error: err}, "error occured while grammar api");
			else 
				score.grammarScore = body.score; 
			waterfallCb(err, score);
		});
	}], function (err, wfData) {
		req.dataStore.score = score;
		callback(null);
	});
}