const express = require("express");
const mongoose = require("mongoose");
const fetch = require("node-fetch");

const app = express();


// All lists for specific searches
let cuisines = [];
let establishments = [];
let categories = [];

const userKey = require(__dirname + "/apiKey.js");

app.get("/", function (req, res) {
    //Only request data if not requested before
    if (cuisines.length === 0) {
        //Get all Cuisines
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
                cuisines.push(data.cuisines);
                console.log("Requested cuisine data");
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
                establishments.push(data.establishments);
                console.log("Requested establishment data");
            })

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
                categories.push(data.categories);
                console.log("Requested category data");
            })
    }

});

app.get("/all", function (req, res) {

    cuisines.forEach(function (cuisineList) {
        cuisineList.forEach(function (cuisine) {
            res.write(cuisine.cuisine.cuisine_name + "\n");
        })
    });
    res.send();
});




app.listen("5000", function () {
    console.log("Backend server started at port 5000!");
});
