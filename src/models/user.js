const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
	{
		firstName: {
			type: String,
			required: true,
			minLength: 4,
			maxLength: 50,
		},
		lastName: {
			type: String,
		},
		emailId: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
			validate(value) {
				if (!validator.isEmail(value)) {
					throw new Error("Invalid Email" + value);
				}
			},
		},
		password: {
			type: String,
			required: true,
			validate(value) {
				if (!validator.isStrongPassword(value)) {
					throw new Error("Enter a strong password");
				}
			},
		},
		age: {
			type: Number,
			min: 18,
		},
		gender: {
			type: String,
			validate(value) {
				if (!["male", "female", "others"].includes(value)) {
					throw new Error("Gender not valid");
				}
			},
		},
		photoUrl: {
			type: String,
			default:
				"https://www.shutterstock.com/image-vector/vector-design-avatar-dummy-sign-600nw-1290556063.jpg",
			validate(value) {
				if (!validator.isURL(value)) {
					throw new Error("Invalid Photo Url" + value);
				}
			},
		},
		about: {
			type: String,
			default: "This is default",
		},
		skills: {
			type: [String],
		},
	},
	{
		timestamps: true,
	}
);

userSchema.methods.getJWT = async function () {
	const user = this;
	const token = await jwt.sign({ _id: user._id }, "DEV@TFGYHUGGU", {
		expiresIn: "1d",
	});
	return token;
};

userSchema.methods.validatePassword = async function (password) {
	const user = this;
	const isPasswordValid = await bcrypt.compare(password, user.password);
	return isPasswordValid;
};

module.exports = mongoose.model("User", userSchema);
