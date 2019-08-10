'use strict'

const express = require('express');
const router = new express.Router();

const assignment = require(global.__base + 'controllers/index.js').assignment;
const student = require(global.__base + 'controllers/index.js').student;
const leaderboard = require(global.__base + 'controllers/index.js').leaderboard;
const credentials = require(global.__base + 'credentials/index.js');
const KnolspakeService = require(global.__base + 'knolspakeService/service/index.js');
const io = require(global.__base + 'io.js');

router.get('/_stat', function (req, res) {
	res.send('OK');
});

router.post('/assesment/_create', [
	credentials.validateTeacher
]);

router.post('/assesment/_update', [ 
	credentials.validateTeacher
]);

router.post('/assesment/_delete', [ 
	credentials.validateTeacher
]);

router.post('/student/_delete', [ 
	credentials.validateTeacher, student.validateStudentDetails, student.load, student.deleteStudent, student.terminate
]);

router.post('/student/_create', [ 
	credentials.validateTeacher, student.validateStudentDetails, student.load, student.createStudent, student.terminate
]);

router.post('/student/_update', [ 
	credentials.validateTeacher, student.validateStudentDetails, student.load, student.updateStudent, student.terminate
]);

router.post('/assign',[
	credentials.validateTeacher, assignment.assign, assignment.terminate
]);

router.post('/unassign', [
	credentials.validateTeacher, assignment.unassign, assignment.terminate
]);

router.post('/submit', [ 
	credentials.validateStudent, assignment.validateAssignment, assignment.load, KnolspakeService.evaluateScore, assignment.pinScore, assignment.terminate
]);

router.post('/getRanking', [
	leaderboard.load, leaderboard.totalScoreSorter, leaderboard.terminate
]);

router.post('/getSpellRanking', [
	credentials.validateStudent, leaderboard.load, leaderboard.spellingScoreSorter, leaderboard.terminate
]);

router.post('/getGrammRanking', [
	credentials.validateStudent, leaderboard.load, leaderboard.grammarScoreSorter, leaderboard.terminate
]);

router.post('/getRelevRanking', [
	credentials.validateStudent, leaderboard.load, leaderboard.relevanceScoreSorter, leaderboard.terminate
]);

router.use(io.respond)

module.exports = router;