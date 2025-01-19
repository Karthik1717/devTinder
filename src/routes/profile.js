const express = require("express");
const bcrypt = require("bcrypt");
const { userAuth } = require("../middleware/auth");
const {
	validateEditProfileData,
	validateEditPasswordData,
} = require("../utils/validation");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
	try {
		const { user } = req;
		res.send(user);
	} catch (err) {
		res.status(400).send("Error : " + err.message);
	}
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
	try {
		if (!validateEditProfileData(req)) {
			throw new Error("Invalid Edit Request");
		}
		const loggedInUser = req.user;
		Object.keys(req.body).forEach(
			(key) => (loggedInUser[key] = req.body[key])
		);
		await loggedInUser.save();
		res.json({
			message: `${loggedInUser.firstName}, your profile was updated successfully!`,
			data: loggedInUser,
		});
	} catch (err) {
		res.status(400).send("Error : " + err.message);
	}
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
	try {
		validateEditPasswordData(req);

		const { currentPassword, newPassword } = req.body;
		const loggedInUser = req.user;
		console.log(currentPassword);
		const isCurrentPasswordValid = await loggedInUser.validatePassword(
			currentPassword
		);

		console.log(isCurrentPasswordValid);
		if (!isCurrentPasswordValid) {
			throw new Error("Enter correct password");
		}
		const passwordHash = await bcrypt.hash(newPassword, 10);
		loggedInUser.password = passwordHash;
		await loggedInUser.save();
		res.send("Password Updated Successfully!");
	} catch (err) {
		res.status(400).send("Error : " + err.message);
	}
});

module.exports = profileRouter;
