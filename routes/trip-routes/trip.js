const express = require("express");
const router = express.Router();
const Trip = require("../../models/Trip.model");
const User = require("../../models/User.model");
const axios = require("axios");

/* Read Route - Trip list page */
router.get("/", (req, res, next) => {
    // Trip.find()
    //     .then((tripsFromDb) => {
    //         console.log({ tripsFromDb });

    //         data = {
    //             trips: tripsFromDb,
    //             hasTrips: tripsFromDb.length > 0,
    //         };

    //         res.render("trips/list", data);
    //         // ** create view page
    //     })
    //     .catch((err) => next(err));

    if (!req.session.user) {
        res.render("trips/list", { hasTrips: false });
        return;
    }

    // Since we are now storing the trip data to the user and want to only get the trips that belong to the current user, we will now search for the logged in user, populate that users array with the trips we want. Then pass that populated data to the page to be viewed.

    User.findById(req.session.user._id)
        .populate("travelLocations")
        .then((currentUserFromDb) => {
            // console.log({ currentUserFromDb });
            axios
                .get("https://restcountries.com/v3.1/all")
                .then((allCountriesFromApi) => {
                    console.log({
                        countries: allCountriesFromApi.data
                            .map((country) => country.name.common)
                            .sort(),
                        // countriesFromApi: allCountriesFromApi.data,
                    });

                    // if limited on the calls from the api, try creating an initial seed route to grab all the data once from the api, and create a model for that data, store it in your DB, then call the needed data from your own DB when required. * this should only be done with data that is not going to be changing so that you do not have inconsistent information given to the user.

                    data = {
                        trips: currentUserFromDb.travelLocations,
                        hasTrips: currentUserFromDb.travelLocations.length > 0,
                        countries: allCountriesFromApi.data
                            .map((country) => country.name.common)
                            .sort(),
                    };

                    res.render("trips/list", data);
                })
                .catch((err) => next(err));
        })
        .catch((err) => next(err));
});

/* Read Route - Trip Details page */
router.get("/details/:tripId", (req, res, next) => {
    Trip.findById(req.params.tripId)
        .populate("tasksIWillDoAtSaidLocation")
        .then((tripFromDb) => {
            // console.log({ tripFromDb });
            axios
                .get(
                    `https://restcountries.com/v3.1/name/${tripFromDb.country}`
                )
                .then((countryFromApi) => {
                    console.log({ country: countryFromApi.data[0].flag });
                    data = {
                        trip: tripFromDb,
                        tasksPlanned:
                            tripFromDb.tasksIWillDoAtSaidLocation.length > 0,
                        country: countryFromApi.data[0],
                    };
                    res.render("trips/details", data);
                })
                .catch((err) => next(err));
        })
        .catch((err) => next(err));
});

/* Create Route - create trip with redirect */
router.post("/create", (req, res, next) => {
    if (!req.session.user) {
        // res.redirect("/auth/login");
        res.render("auth/login", {
            errorMessage: "Please login in order to create a trip",
        });
        return;
    }

    Trip.create(req.body)
        .then((createdTrip) => {
            // console.log({ createdTrip });
            User.findByIdAndUpdate(
                req.session.user._id,
                {
                    $push: { travelLocations: createdTrip._id },
                },
                { new: true }
            )
                .then((updatedUser) => {
                    // *** anytime you update data on the user, remember to update the session user data. ***
                    req.session.user = updatedUser;
                    // console.log({ updatedUser, createdTrip });
                    // res.render('trips/details', {trip: createdTrip});
                    res.redirect(`/trips/details/${createdTrip._id}`);
                })
                .catch((err) => next(err));
        })
        .catch((err) => next(err));
});

/** Update Route - Add or remove a task from the trip */
router.post("/update/:tripId", (req, res, next) => {});

/** Delete Route - Delete Trip from user and DB */
router.get("/delete/:tripId", (req, res, next) => {
    User.findByIdAndUpdate(
        req.session.user._id,
        {
            $pull: { travelLocations: req.params.tripId },
        },
        { new: true }
    )
        .then((updatedUser) => {
            // console.log({ deleteTrip: req.params.tripId, updatedUser });
            // *** anytime you update data on the user, remember to update the session user data. ***
            req.session.user = updatedUser;

            Trip.findByIdAndDelete(req.params.tripId)
                .then(() => {
                    // console.log({ DeleteMessage: "successfully deleted trip" });
                    res.redirect("/trips");
                })
                .catch((err) => next(err));
        })
        .catch((err) => next(err));
});

module.exports = router;
