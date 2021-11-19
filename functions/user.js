const User = require("../models/user");

exports.getUserById = (req, res, next, id) => {
	User.findById(id).exec((err, user) => {
		if (err) {
			return res.status(400).json({
				message: err
			});
		}
		if (!user) {
			return res.status(400).json({
				message: "User doesn't exist"
			});
		}
		req.profile = user;
		next();
	});
};
