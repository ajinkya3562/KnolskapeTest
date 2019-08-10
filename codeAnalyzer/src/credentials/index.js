'use strict'
const credentials = require(global.__base + 'constants/index.js');
const Codes = require(global.__base + 'Helpers/codes.js');

exports.validateTeacher = function (req, res, next) {
	let token = credentials.credentials.teacher.token;
	if (req.body.token !== token) {
		req.dataStore.responseCode = Codes.methodMapper.assignment.invalidToken;
	}
	next(req.dataStore.responseCode);
}

exports.validateStudent = function (req, res, next) {
	let token = credentials.credentials.student.token;
	if (req.body.token !== token) {
		req.dataStore.responseCode = Codes.methodMapper.assignment.invalidToken;
	}
	next(req.dataStore.responseCode);
}