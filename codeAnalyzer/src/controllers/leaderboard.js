'use strict'

const Config = require(global.__base + 'conf/index.js');

exports.load = function (req, res, next) {
	req.mongo.query(req.mongo.studentCollection, Config.mongodb.operations.find, {}, (error, studentData) => {
		if (error) {
			req.logger.error({error: JSON.stringify(error)}, "Error while searching for student data");
			req.dataStore.responseCode = Codes.methodMapper.assignment.mongoSearchError;
		} else if (!studentData) {
			req.dataStore.studentAbsent = true;
			req.logger.info({error: "missing student valid to create new student data"}, "This student id is not present in db");
		} else {
			req.dataStore.studentList = studentData;
		}
		next(req.dataStore.responseCode);
	});
}

exports.spellingScoreSorter = function (req, res, next) {
	let sortable = [];
	
	for (var student of req.dataStore.studentList) {
	    	sortable.push([student, student.spellingScore]);
	}
	sortable.sort(function(a, b) {
	    return b[1] - a[1];
	});
	req.dataStore.sortable = sortable;
	next();
}

exports.grammarScoreSorter = function (req, res, next) {
	let sortable = [];
	
	for (var student of req.dataStore.studentList) {
    	sortable.push([student, student.grammarScore]);
	}
	sortable.sort(function(a, b) {
	    return b[1] - a[1];
	});
	req.dataStore.sortable = sortable;
	next();
}

exports.relevanceScoreSorter = function (req, res, next) {
	let sortable = [];
	
	for (var student of req.dataStore.studentList) {

    	sortable.push([student, student.relevanceScore]);
	}
	sortable.sort(function(a, b) {
	    return b[1] - a[1];
	});
	req.dataStore.sortable = sortable;
	next();
}

exports.totalScoreSorter = function (req, res, next) {
	let sortable = [];
	
	for (var student of req.dataStore.studentList) {
	    sortable.push([student, student.grammarScore + student.relevanceScore + student.spellingScore]);
	}
	sortable.sort(function(a, b) {
	    return b[1] - a[1];
	});
	req.dataStore.sortable = sortable;
	next();
}

exports.terminate = function (req, res, next) {
	req.body.ranking = req.dataStore.sortable;
	next();
}