const mongoose = require("mongoose");

const connnectionRequestSchema = new mongoose.Schema(
	{
		fromUserId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		toUserId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		status: {
			type: String,
			required: true,
			enum: {
				values: ["ignored", "interested", "accepted", "rejected"],
				message: `{VALUE} is incorrect status type`,
			},
		},
	},
	{
		timestamps: true,
	}
);

connnectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

connnectionRequestSchema.pre("save", function (next) {
	const connectionRequest = this;
	if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
		throw new Error("Cannot send connection request to yourself!");
	}
	next();
});

const ConnnectionRequestModel = mongoose.model(
	"ConnectionRequest",
	connnectionRequestSchema
);

// mongoose.model("User", userSchema);

module.exports = ConnnectionRequestModel;
