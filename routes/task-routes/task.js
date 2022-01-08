const express = require("express");
const router = express.Router();
const Task = require("../../models/Task.model");
const Trip = require("../../models/Trip.model");

/* Read Route - Task Details page */
router.get("/details/:taskId/:tripId", (req, res, next) => {
    Task.findById(req.params.taskId)
        .then((taskFromDb) => {
            // console.log({ taskFromDb });
            data = {
                task: taskFromDb,
                tripId: req.params.tripId,
            };
            res.render("tasks/details", data);
            // res.render("tasks/details", {
            //     task: taskFromDb,
            //     tripId: req.params.tripId,
            // });
        })
        .catch((err) => next(err));
});

/** Read Route - Task Create Page */
/** Update Route - Task Update display based on 'editTask' query being passed to endpoint as param */
router.get("/create/:tripId", (req, res, next) => {
    if (!req.session.user) {
        // res.redirect("/auth/login");
        res.render("auth/login", {
            errorMessage:
                "Please login in order to create a task for your trip",
        });
        return;
    }
    Trip.findById(req.params.tripId)
        .then((tripFromDb) => {
            if (!!req.query.editTask) {
                Task.findById(req.query.editTask)
                    .then((taskFromDb) => {
                        // console.log({ update: taskFromDb });
                        data = {
                            task: taskFromDb,
                            trip: tripFromDb,
                            // editTask: req.params.editTask ? true : false,
                            // editTask: !!req.params.editTask,
                            editTask: !!req.query.editTask,
                            // "/create/:tripId?editTask=someValueHere"
                            // using the query method to check if a param is passed, allows you to add additional fields to the endpoint without having to go back into your hbs files and find this routes endpoint and modify it. You can instead just pass the required query param into the endpoints that would require it.
                            // using this method, you can make a route more dynamic allowing for use of a single page to do multiple things. You may even pass data such as messages in the query to display on a certain page.
                        };
                        res.render("tasks/create", data);
                        return;
                    })
                    .catch((err) => next(err));
            } else {
                // console.log({ create: tripFromDb });
                data = {
                    trip: tripFromDb,
                    // editTask: req.params.editTask ? true : false,
                    // editTask: !!req.params.editTask,
                    editTask: !!req.query.editTask,
                    // "/create/:tripId?editTask=someValueHere"
                    // using the query method to check if a param is passed, allows you to add additional fields to the endpoint without having to go back into your hbs files and find this routes endpoint and modify it. You can instead just pass the required query param into the endpoints that would require it.
                    // using this method, you can make a route more dynamic allowing for use of a single page to do multiple things. You may even pass data such as messages in the query to display on a certain page.
                };
                res.render("tasks/create", data);
            }
        })
        .catch((err) => next(err));
});

/** Create Route - Create Task for Trip and Update Trip Array */
/** Update Route - Update trip details by adding a task */
router.post("/create/:tripId", (req, res, next) => {
    Task.create(req.body)
        .then((createdTrip) => {
            // console.log({ createdTrip });
            Trip.findByIdAndUpdate(
                req.params.tripId,
                {
                    $push: { tasksIWillDoAtSaidLocation: createdTrip._id },
                },
                { new: true }
            )
                .then((updatedTrip) => {
                    // console.log({ updatedTrip });
                    res.redirect(`/trips/details/${updatedTrip._id}`);
                })
                .catch((err) => next(err));
        })
        .catch((err) => next(err));
});

/** Update Route - Task Update */
router.post("/update/:taskId", (req, res, next) => {
    // console.log({ isCompleted: !!req.body.isCompleted, body: req.body });
    Task.findByIdAndUpdate(
        req.params.taskId,
        {
            ...req.body,
            isCompleted: !!req.body.isCompleted,
        },
        { new: true }
    )
        .then((updatedTask) => {
            // console.log({ updatedTask });
            res.redirect("back");
        })
        .catch((err) => next(err));
});

/** Delete Route - Delete task from trip tasks array and delete task from DB */
/** Update Route - Removing the task from the array of tasks in trip */
router.get("/delete/:taskId/:tripId", (req, res, next) => {
    Trip.findByIdAndUpdate(
        req.params.tripId,
        { $pull: { tasksIWillDoAtSaidLocation: req.params.taskId } },
        { new: true }
    )
        .then((updatedTrip) => {
            Task.findByIdAndDelete(req.params.taskId)
                .then(() => {
                    res.redirect(`/trips/details/${req.params.tripId}`);
                })
                .catch((err) => next(err));
        })
        .catch((err) => next(err));
});

module.exports = router;
