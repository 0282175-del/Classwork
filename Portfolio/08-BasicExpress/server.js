const express = require("express");
const bodyParser = require("body-parser");
const path = require("node:path");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/", (req, res) => {
  const weight = Number(req.body.weight);
  const height = Number(req.body.height);

  if (!weight || !height || weight <= 0 || height <= 0) {
    return res.status(400).send("Please enter a valid weight and height.");
  }

  const bmi = (weight / height ** 2) * 10000;

  res.send(`Your BMI is ${bmi.toFixed(2)}`);
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
