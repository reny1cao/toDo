/*jshint esversion: 6 */
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect("mongodb+srv://new-user_0:new-user-Atlas@cluster0-0bwlj.mongodb.net/todolistDB", {useNewUrlParser: true});

const itemSchema = {
    name: String,
    ger: String
};

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
    name: "Welcome to toDo~",
    ger: "home"
});

const item2 = new Item({
    name: "Press + sign to add new toDoes",
    ger: "home"
});

const item3 = new Item({
    name: "Check checkbox if you finished",
    ger: "home"
});

function insertDefalutItems () {
    Item.insertMany([item1, item2, item3], (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("successfully inserted");
    }
    });
}

app.get("/", (req, res) => {
    let today = new Date();
    let options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };

    let date = today.toLocaleDateString("en-US", options);

    Item.find({ger: "home"}, (err, ress) => {
        if (ress.length === 0) {
            insertDefalutItems();
            res.redirect("/");
        }
        if (err) {
            console.log(err);
        } else {
            res.render("list", {
                titles: date,
                newItems: ress
            });
        }
    });
});

app.post("/", (req, res) => {
    if (req.body.list === "Work") {
        let newItem = new Item({
            name: req.body.newItem,
            ger: "work"
        });
        Item.insertMany([newItem]);
        res.redirect("/work");
    } else {
        let newItem = new Item({
            name: req.body.newItem,
            ger: "home"
        });
        Item.insertMany([newItem]);
        res.redirect("/");
    }
});


app.get("/work", (req, res) => {
    Item.find({ger: "work"}, (err, ress) => {
        if (err) {
            console.log(err);
        } else {
            res.render("list", {
                titles: "Work",
                newItems: ress
            });
        }
    });
});

app.get("/about", (req, res) => {
    res.render("about");
});

app.listen("3000", _ => console.log("running on server 3000"));