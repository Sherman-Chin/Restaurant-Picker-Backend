const express = require("express");
const mongoose = require("mongoose");
const fetch = require("node-fetch");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
// app.use(bodyParser.urlencoded({
//     extended: true
// }));

app.use(bodyParser.json());

//Allow access from front end
app.use(cors());

// All lists for specific searches
var cuisines = [];
var establishments = [];
var categories = [];

const userKey = require(__dirname + "/apiKey.js");
//Only request data if not requested before
if (cuisines == undefined || cuisines.length == 0) {
    fetch("https://developers.zomato.com/api/v2.1/cuisines?city_id=70",
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "user-key": userKey
            }
        }).then(function (response) {
            return response.json();
        }).then(function (data) {
            cuisines = data.cuisines;
            console.log("Requested cuisine data");
        }).catch(function (err) {
            console.log(err);
        });

    //Get all Categories
    fetch("https://developers.zomato.com/api/v2.1/establishments?city_id=70",
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "user-key": userKey
            }
        }).then(function (response) {
            return response.json();
        }).then(function (data) {
            establishments = data.establishments;
            console.log("Requested establishment data");
        }).catch(function (err) {
            console.log(err);
        });

    fetch("https://developers.zomato.com/api/v2.1/categories",
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "user-key": userKey
            }
        }).then(function (response) {
            return response.json();
        }).then(function (data) {
            categories = data.categories;
            console.log("Requested category data");
        }).catch(function (err) {
            console.log(err);
        });
}


app.get("/:listType", function (req, res, next) {
    const list = req.params.listType;

    if (list === "cuisines") {
        console.log("Cuisine sent to front-end");
        res.send(cuisines);
    } else if (list === "establishments") {
        console.log("Establishment sent to front-end");
        res.send(establishments);
    } else if (list === "categories") {
        console.log("Category sent to front-end");
        res.send(categories);
    } else {
        res.send("Error in providing list.");
    }
});

app.post("/", function (req, res) {
    const cuisineIDs = req.body.cuisine.map(({ cuisine_id }) => {
        return cuisine_id
    });

    const establishmentIDs = req.body.establishment.map(({ id }) => {
        return id
    });

    const categoryIDs = req.body.category.map(({ id }) => {
        return id
    });

    //Refine here
    let restaurants;
    fetch("https://developers.zomato.com/api/v2.1/search?entity_id=70&entity_type=city&cuisines=" + cuisineIDs.toString() + "&establishment_type=" + establishmentIDs.toString() + "&category=" + categoryIDs.toString(),
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "user-key": userKey,
            }
        }).then(function (response) {
            return response.json();
        }).then(function (data) {
            restaurants=data;
            console.log(data);
        }).catch(function (err) {
            console.log(err);
        });

    console.log(restaurants);
    res.send(restaurants);
});

app.listen("5000", function () {
    console.log("Backend server started at port 5000!");
});
