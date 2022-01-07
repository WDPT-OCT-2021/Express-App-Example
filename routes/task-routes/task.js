const express = require("express");
const router = express.Router();
const Task = require("../../models/Task.model");

/* Read Route - Task Details page */
router.get("/details/:taskId", (req, res, next) => {
    Task.findById(req.params.taskId)
        .then((taskFromDb) => {
            console.log({ taskFromDb });
            res.render("tasks/details", { task: taskFromDb });
        })
        .catch((err) => next(err));
});

module.exports = router;
