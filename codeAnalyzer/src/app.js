'use strict'

global.__base = __dirname + '/';

const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;
const routes = require(global.__base + 'routes/index.js');
const MongoDB = require(global.__base + "store/mongo/index.js"); 
const bodyParser = require('body-parser');
const bunyan = require("bunyan");
const async = require('async');

let mongoDB = new MongoDB();
let logger;

logger = bunyan.createLogger({name: "knolspake", level: "info", src: true});

app.use( bodyParser.json() );       

app.use(bodyParser.urlencoded({     
  extended: true
}));

app.use(function (req, res, next) {
	req.logger = logger.child({
		remoteIp: req.headers["x-real-ip"], clientIp: req.headers["x-forwarded-for"],
		path: req.path, requestId: (req.body && req.body.requestId)
	});
	req.dataStore = {
	};
	next();
});

app.use(function (req, res, next) {
	req.mongo = mongoDB;
	next();
});


async.parallel([function (cb) {
	mongoDB.init(logger, cb);
}], function (err) {
	if (err) {
		throw err;
	} else {
		app.use("/", routes);
		app.listen(PORT, function () {
			logger.info("Express listening on port " + PORT);
		});
	}
});
