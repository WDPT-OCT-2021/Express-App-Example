const { Schema, model } = require("mongoose");

const taskSchema = new Schema(
    {
        title: String,
        description: String,
        duration: String,
        isCompleted: { type: Boolean, default: false },
    },
    {
        // this second object adds extra properties: `createdAt` and `updatedAt`
        timestamps: true,
    }
);

const Task = model("Task", taskSchema);

module.exports = Task;
