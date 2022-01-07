const { Schema, model } = require("mongoose");

const taskSchema = new Schema(
    {
        title: String,
        description: String,
        duration: String,
        createdDate: Date | String,
        isCompleted: Boolean,
    },
    {
        // this second object adds extra properties: `createdAt` and `updatedAt`
        timestamps: true,
    }
);

const Task = model("Task", taskSchema);

module.exports = Task;
