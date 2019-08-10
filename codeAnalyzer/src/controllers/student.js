"use strict"
const Config = require(global.__base + 'conf/index.js');
const Codes = require(global.__base + 'Helpers/codes.js');

exports.validateStudentDetails = function (req, res, next) {
	let studentDetails = req.body.students;

	if (!studentDetails.name || !studentDetails.id) {
		req.dataStore.responseCode = Codes.methodMapper.student.invalidStudentDetails;
	}
	next(req.dataStore.responseCode);
}

exports.load = function (req, res, next) {
	req.dataStore.studentAbsent = false;
	req.mongo.queryOne(req.mongo.studentCollection, Config.mongodb.operations.findOne, {id: req.body.students.id}, (error, studentData) => {
		if (error) {
			req.logger.error({error: JSON.stringify(error)}, "Error while searching for student data");
			req.dataStore.responseCode = Codes.methodMapper.assignment.mongoSearchError;
		} else if (!studentData) {
			req.dataStore.studentAbsent = true;
			req.logger.info({error: "missing student valid to create new student data"}, "This student id is not present in db");
		} else {
			req.dataStore.studentInDb = studentData;
		}
		next(req.dataStore.responseCode);
	});
};

exports.createStudent = function (req, res, next) {
	if (!req.dataStore.responseCode && req.dataStore.studentAbsent) {
		let data = {
			'id': req.body.students.id,
			'name': req.body.students.name,
			'spellingScore': 0,
			'grammarScore': 0,
			'relevanceScore': 0,
			'assignedTasks': []
		};

		req.mongo.store(req.mongo.studentCollection, Config.mongodb.operations.insert, data, (error) => {
			if (error) {
				req.logger.fatal({error: String(error), studentSaveData: JSON.stringify(data)}, "Error while storing student information");
				req.dataStore.responseCode = Codes.methodMapper.assignment.mongoStoreError;
			} else {
				req.logger.info({studentSaveData: JSON.stringify(data)}, "Successfully stored the new student information into database");
			}
		});
	} else {
		//student data present
		req.logger.info({id: req.body.students.id, name: req.body.students.name},"Already present studentin database");
	}
	next();
}

exports.updateStudent = function (req, res, next) {
	if (!req.dataStore.responseCode && !req.dataStore.studentAbsent) {
		let data = {
			'id': req.body.students.id,
			'name': req.body.students.name,
			'spellingScore': req.dataStore.studentInDb.spellingScore,
			'grammarScore': req.dataStore.studentInDb.grammarScore,
			'relevanceScore': req.dataStore.studentInDb.relevanceScore,
			'assignedTasks': req.dataStore.studentInDb.assignedTasks
		};
		req.mongo.updateOne(req.mongo.studentCollection, Config.mongodb.operations.updateOne, {"id": req.body.students.id}, data, (error) => {
			if (error) {
				req.logger.fatal({error: String(error), studentSaveData: JSON.stringify(data)}, "Error while updating student information");
				req.dataStore.responseCode = Codes.methodMapper.assignment.mongoStoreError;
			} else {
				req.logger.info({studentSaveData: JSON.stringify(data)}, "Successfully updated the new student information into database");
			}
		});
	}
	next();
}

exports.deleteStudent = function (req, res, next) {
	if (!req.dataStore.responseCode && !req.dataStore.studentAbsent) {
		let data = {
			'id': req.body.students.id,
			'name': req.body.students.name
		};
		req.mongo.updateOne(req.mongo.studentCollection, Config.mongodb.operations.updateOne, {"id": req.body.students.id}, {}, (error) => {
			if (error) {
				req.logger.fatal({error: String(error), studentSaveData: JSON.stringify(data)}, "Error while updating student information");
				req.dataStore.responseCode = Codes.methodMapper.assignment.mongoStoreError;
			} else {
				req.logger.info({studentSaveData: JSON.stringify(data)}, "Successfully deleted a student information from database");
			}
		});
	}
	next();
}

exports.terminate = function (req, res, next) {
	next();
}