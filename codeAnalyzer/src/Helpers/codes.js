exports.methodMapper = {
	common: {
		success: "TFI2_0000",
		not_found: "TFI4_0000",
		server_error: "TFI5_0000"
	},
	student: {
		studentNotFoundInDB: "TFI5_0100",
		invalidStudentDetails: "TFI4_0100"

	},
	assignment: {
		mongoSearchError: "TFI5_0201",
		partnerGenericError: "TFI5_0202",
		mongoStoreError: "TFI5_0203",
		invalidAssignmentDetails: "TFI4_0200",
		invalidTopicsDetails: "TFI4_0201",
		invalidToken: "TFI4_0202"
	},
	leaderboard: { 
	}
};

exports.responseCodes = {
	TFI4_0100: {
		debugMessage: "Check for student Details.",
		message: "Student Details are not proper.",
		httpStatus: 400
	},
	TFI4_0200: {
		debugMessage: "Check for assignment information.",
		message: "Assignment information is missing or not proper.",
		httpStatus: 400
	},
	TFI4_0201: {
		debugMessage: "Check for topics information.",
		message: "Topics information is missing or not proper.",
		httpStatus: 400
	},
	TFI4_0202: {
		debugMessage: "Not a valid user to use this API.",
		message: "Invalid Token.",
		httpStatus: 400
	},
	TFI5_0100: {
		debugMessage: "Student details not found in db.",
		message: "Student Details not found in db.",
		httpStatus: 500
	},
	TFI5_0201: {
		debugMessage: "Mongo search error.",
		message: "Mongo search error.",
		httpStatus: 500
	},
	TFI5_0202: {
		debugMessage: "Check for outbound segments ",
		message: "Outbound segments are missing.",
		httpStatus: 500
	},
	TFI5_0203: {
		debugMessage: "Check for outbound segments ",
		message: "Outbound segments are missing.",
		httpStatus: 500
	}
}