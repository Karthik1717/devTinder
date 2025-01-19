const mongoose = require("mongoose");

const connectDB = async () => {
	await mongoose.connect(
		"mongodb+srv://lastjedi:TgHfhOT2gRTcj0yr@nodejs.5rbm8.mongodb.net/devTinder"
	);
};

module.exports = connectDB;
