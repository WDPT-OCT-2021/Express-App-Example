const { Schema, model } = require("mongoose");

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
        },
        password: String,
        travelLocations: [{ type: Schema.Types.ObjectId, ref: "Trip" }],
    },
    {
        // this second object adds extra properties: `createdAt` and `updatedAt`
        timestamps: true,
    }
);

const User = model("User", userSchema);

module.exports = User;
