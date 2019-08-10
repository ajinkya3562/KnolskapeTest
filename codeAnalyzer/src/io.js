
exports.respond = function (req, res) {
	let responseCodeData, message, response;
	let body = req.body || {};

	req.responseCode = req.responseCode || "200";

	response = {
		status: "success",
		message: req.message || "",
		responseCode: req.responseCode,
		body: req.body
	};
	res.status(req.responseCode).send(response);
};