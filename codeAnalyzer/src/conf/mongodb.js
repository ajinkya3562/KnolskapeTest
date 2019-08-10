"use strict";

let mongodb = require("mongodb");

let mongodb_config = {
	db_name: "practice",
	replica_set: "rs0",
	servers: [
		{
			host: "localhost",
			port: "27017"
		}
	],
	db_options: {
		poolSize: 20,
		autoReconnect: true,
		keepAlive: 60000,
		connectTimeoutMS: 30000,
		reconnectTries: 30,
		reconnectInterval: 500,
		readPreference: mongodb.ReadPreference.SECONDARY_PREFERRED
	}
};

module.exports = {
	config: mongodb_config,
	operations: {
		insert: "insert",
		save: "save",
		find: "find",
		findOne: "findOne",
		updateOne: "updateOne",
		replaceOne: "replaceOne"
	},
	url: (() => {
		let servers = mongodb_config.servers.map((item) => {
			return (`${item.host}:${item.port}`);
		}).join(",");

		return `mongodb://${servers}/${mongodb_config.db_name}?replicaSet=${mongodb_config.replica_set}`;
	})()
};
