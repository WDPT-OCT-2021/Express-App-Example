const { Schema, model } = require("mongoose");

const tripSchema = new Schema(
    {
        location: String,
        tasksIWillDoAtSaidLocation: [
            { type: Schema.Types.ObjectId, ref: "Task" },
        ],
        travelStartDate: Date | String,
        travelEndDate: Date | String,
        cost: String,
        locationsToVisit: [
            { type: Schema.Types.ObjectId, ref: "locationToVisitOnTrip" },
        ],
        afterTripThoughts: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    },
    {
        // this second object adds extra properties: `createdAt` and `updatedAt`
        timestamps: true,
    }
);

const Trip = model("Trip", tripSchema);

module.exports = Trip;
