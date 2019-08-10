"use strict";

const MongoClient = require("mongodb").MongoClient;
const bunyan = require("bunyan");
const Config = require(global.__base + "conf");

let logger = bunyan.createLogger({name: "knolspake", level: "info", scope: "redis"});

let MongoDB = function (log) {
	this.log = log || logger;
	this.mongodb = null;
	this.studentCollection = null;
};

module.exports = MongoDB;

MongoDB.prototype.init = function (initLogger, callback) {
	let self = this;

	MongoClient.connect(Config.mongodb.url, Config.mongodb.config.db_options, function (connectionError, db) {
		if (connectionError) {
			initLogger.error({error: String(connectionError)}, "Error occurred while connecting to mongodb");
		} else {
			initLogger.info("Successfully connected to mongodb");
			self.mongodb = db;
			self.studentCollection = self.mongodb.collection("knolspake.student");
			callback(null);
		}
	});
};

MongoDB.prototype.store = function (collection, operation, data, callback) {
	collection[operation](data, callback);
};

MongoDB.prototype.query = function (collection, operation, query, callback) {
	let cursor = collection.find();
	let arr = [];
	cursor.each(function(err, item){
		if(item == null) {
	        callback(err, arr);
	    } else if (item.id) {
	    	arr.push(item);
	    }
	});
};

MongoDB.prototype.queryOne = function (collection, operation, query, callback) {
	collection[operation](query, callback);
};

MongoDB.prototype.updateOne = function (collection, operation, query, data, options, callback) {
	collection[operation](query, data, options, callback);
};

MongoDB.prototype.replaceOne = function (collection, operation, query, data, options, callback) {
	collection[operation](query, data, options, callback);
};

