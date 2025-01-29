const express = require("express");
const bcrypt = require("bcrypt");

const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
	try {
		validateSignUpData(req);
		const { firstName, lastName, emailId, password } = req.body;
		const passwordHash = await bcrypt.hash(password, 10);

		const user = new User({
			firstName,
			lastName,
			emailId,
			password: passwordHash,
		});
		const savedUser = await user.save();
		const token = await savedUser.getJWT();

		res.cookie("token", token, {
			expires: new Date(Date.now() + 8 * 3600000),
		});
		res.json({ message: "User Added successfully!", data: savedUser });
	} catch (err) {
		res.status(400).send("Error : " + err.message);
	}
});

authRouter.post("/login", async (req, res) => {
	try {
		const { emailId, password } = req.body;

		const user = await User.findOne({ emailId: emailId });
		if (!user) {
			throw new Error("Email ID is not found");
		}
		const isPasswordValid = await user.validatePassword(password);
		if (isPasswordValid) {
			const token = await user.getJWT();

			res.cookie("token", token, {
				expires: new Date(Date.now() + 8 * 3600000),
			});
			res.send(user);
		} else {
			throw new Error("Wrong Password");
		}
	} catch (err) {
		res.status(400).send("Error : " + err.message);
	}
});

authRouter.post("/logout", async (req, res) => {
	res.cookie("token", null, {
		expires: new Date(Date.now()),
	});
	res.send("Logout Successfull!");
});

module.exports = authRouter;
