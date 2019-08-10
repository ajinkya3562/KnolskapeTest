'use strict'

const Config = require(global.__base + 'conf/index.js');
const Codes = require(global.__base + 'Helpers/codes.js');

exports.validateAssignment = function (req, res, next) {
	if (typeof req.body.text !== 'string' || req.body.text.length <= 0) {
		req.dataStore.responseCode = Codes.methodMapper.assignment.invalidAssignmentDetails;
	} else if (!Array.isArray(req.body.topics)) {
		req.dataStore.responseCode = Codes.methodMapper.assignment.invalidTopicsDetails;
	} else if (Array.isArray(req.body.topics)) {
		for (let s of req.body.topics) {
			if (typeof s !== 'string') {
				req.dataStore.responseCode = Codes.methodMapper.assignment.invalidTopicsDetails;
				break;
			}
		}
	}
	next(req.dataStore.responseCode);
}

exports.assign = function (req, res, next) {
	let data = {
		id: req.body.students.id,
		name: req.dataStore.studentInDb.name,
		relevanceScore: Number(req.dataStore.studentInDb.relevanceScore),
		spellingScore: Number(req.dataStore.studentInDb.spellingScore),
		grammarScore: Number(req.dataStore.studentInDb.grammarScore),
		assignedTasks: req.dataStore.studentInDb.assignedTasks.push({id: req.body.task.id})
	};

	req.mongo.updateOne(req.mongo.studentCollection, Config.mongodb.operations.updateOne, {"id": req.body.students.id}, data, (error) => {
		if (error) {
			req.logger.fatal({error: String(error), studentSaveData: JSON.stringify(data)}, "Error while assigning student a task");
			req.dataStore.responseCode = Codes.methodMapper.assignment.mongoStoreError;
		} else {
			req.logger.info({studentSaveData: JSON.stringify(data)}, "Successfully assigned a task to a student into database");
		}
	});

	next();

}

exports.unassign = function (req, res, next) {
	
	req.dataStore.studentInDb.assignedTasks = req.dataStore.studentInDb.assignedTasks.splice(req.dataStore.studentInDb.assignedTasks.findIndex(v=>v.id === req.body.task.id),1);
	
	let data = {
		id: req.body.students.id,
		name: req.dataStore.studentInDb.name,
		relevanceScore: Number(req.dataStore.studentInDb.relevanceScore),
		spellingScore: Number(req.dataStore.studentInDb.spellingScore),
		grammarScore: Number(req.dataStore.studentInDb.grammarScore),
		assignedTasks: req.dataStore.studentInDb.assignedTasks
	};

	req.mongo.updateOne(req.mongo.studentCollection, Config.mongodb.operations.updateOne, {"id": req.body.students.id}, data, (error) => {
		if (error) {
			req.logger.fatal({error: String(error), studentSaveData: JSON.stringify(data)}, "Error while unassigning task information");
			req.dataStore.responseCode = Codes.methodMapper.assignment.mongoStoreError;
		} else {
			req.logger.info({studentSaveData: JSON.stringify(data)}, "Successfully unassigned the task from a student");
		}
	});

	next();
}

exports.load = function (req, res, next) {
	req.dataStore.studentAbsent = false;
	req.mongo.queryOne(req.mongo.studentCollection, Config.mongodb.operations.findOne, {id: req.body.students.id}, (error, studentData) => {
		if (error) {
			req.logger.error({error: JSON.stringify(error)}, "Error while searching for student data");
			req.dataStore.responseCode = Codes.methodMapper.assignment.mongoSearchError;
		} else if (!studentData) {
			req.dataStore.studentAbsent = true;
			req.logger.info({error: "missing student data for assignment apis"}, "This student id is not present in db");
		} else {
			req.dataStore.studentInDb = studentData;
		}
		next(req.dataStore.responseCode);
	});
}


exports.pinScore = function (req, res, next) {
	let data = {
		id: req.body.students.id,
		name: req.dataStore.studentInDb.name,
		relevanceScore: Number(req.dataStore.studentInDb.relevanceScore) + req.dataStore.score.relevanceScore,
		spellingScore: Number(req.dataStore.studentInDb.spellingScore) + req.dataStore.score.spellingScore,
		grammarScore: Number(req.dataStore.studentInDb.grammarScore) + req.dataStore.score.grammarScore,
		assignedTasks: req.dataStore.studentInDb.assignedTasks
	};

	req.mongo.updateOne(req.mongo.studentCollection, Config.mongodb.operations.updateOne, {"id": req.body.students.id}, data, (error) => {
		if (error) {
			req.logger.fatal({error: String(error), studentSaveData: JSON.stringify(data)}, "Error while updating student information");
			req.dataStore.responseCode = Codes.methodMapper.assignment.mongoStoreError;
		} else {
			req.logger.info({studentSaveData: JSON.stringify(data)}, "Successfully updated the scoring information into database");
		}
	});

	next();
}

exports.terminate = function (req, res, next) {
	req.body.score = req.dataStore.score;
	next();
}