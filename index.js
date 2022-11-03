const express = require('express'); // importing express
const app = express(); // creating an express app

// changing the view engine so we can use ejs

app.set("view engine", "ejs");
app.set("etag", false);

// setups for receiving arguments from the site page

app.use(require('body-parser').urlencoded({ extended: false }));
app.use(express.static(__dirname + '/views'));

app.listen(80, () => console.log("webserver started.")); // Starting the node server on port 80 (you can change it to whatever you want)

// main page route: GET

app.get("/", (req, res) => {
    res.render("index.ejs", { error: null }); // {error: null} is for flashes and error messages
});

// main page route: POST

app.post("/", (req, res) => {

    // getting the height and weight from the form

    let height = req.body.height;
    let weight = req.body.weight;

    // filtering and deleting spaces between numbers

    height = height.split("").filter(i => String(i).trim()).join("");
    weight = weight.split("").filter(i => String(i).trim()).join("");

    // checking if the argument is a number

    if (isNaN(height) || isNaN(weight)) return res.render("index.ejs", { error: "Please use real numbers." }); // error will be the flash message

    // running the main function to calculate BMI

    const result = calculateBMI(height, weight, (error) => {
        return res.render("index.ejs", { error: error });
    });

    // rendering the result

    res.render("results.ejs", { result: String(result) });
});

// main calculation function

function calculateBMI(height, weight, error) {

    // checking that the number is not negative

    if (Number(height) <= 0) return error("How can you have a negative height");
    if (Number(weight) <= 0) return error("How can you have a negative weight");

    // the BMI simple calculation (weight / height^2)

    height = parseInt(height) / 100;
    weight = parseInt(weight);

    let result = weight / (height * height);

    // returning the results basing on the calculations
    /* 
    results < 18.5 => underweight
    18.5 <= results < 25 => Normale Range
    25 <= results < 30 => Overweight
    30 <= results < 40 => Obesity
    results >= 40 => Severe Obesity
    */

    if (result < 18.5) return "Underweight";
    if (result >= 18.5 && result < 25) return "Normal Range";
    if (result >= 25 && result < 30) return "Overweight";
    if (result >= 30 && result < 40) return "Obesity";
    if (result >= 40) return "Severe Obesity";

    // incase something else happened or some unhandled error

    return error("Unexpected Error, try again.");
}