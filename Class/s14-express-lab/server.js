import express from 'express'
// const express = requiere('express');
// import axios from 'axios';
import weatherRoutes from "./routes/weatherRoutes.js"
import { getWeatherFrom } from './services/meteo-service.js';
import { WeatherRoutes, errorMiddleware } from "./errors/error-handler.js"
import { connectDB } from "./config/db";

const app = express();
app.use(express.json()); //Middleware
import { loadEnvFile } from "node:process";
loadEnvFile();
const dbuser = process.env.DB_USER;
const dbPass = process.env.DB_PASSWORD;
const dbNAme = "bdays";

const scientists = [
    { id: 1, name: "Dr. Elena Rostova", department: "Climate", projects: 4 },
    { id: 2, name: "Prof. Marcus Vance", department: "Oceanography", projects: 2 },
    { id: 3, name: "Dr. Aisha Khan", department: "Climate", projects: 7 }
];

const initiatives = [];

mongoUrl = `mongodb+srv://$(dbUser):${dbPass}@cluster0.`

class WeatherError extends Error {
    constructor(message, statusCode, rootCauseClass){
        super(message);
        this.name
    }
}

app.get("/", (req, res) => {
  res.send(
        `<div style="font-family: sans-serif; padding: 20px;>
            <h1>Welcome to My WebApp</h1>
            <p>This is a simple Express.js application.</p>
        </div>`
    )
});

// /greet?name=***&city=**
app.get("/greet", (req, res) => {
    const {name, city} = req.query; //<- Destructuring
    res.send(`Hello, ${name}, how is the weather in ${city}`);
});

// /api/scientist?dept=***
app.get('/api/scientists', (req, res) => {
    const { dept } = req.query;
    if (dept) {

        /*const result = [];
        for(const scientist of scientists){
            if (scientist.department === dept)
                result.push(scientist);
        }*/
        const result = scientists.filter(
            (scientist) => scientist.department.toLowerCase() === dept.toLowerCase()
        );
        if (result && result.lenght > 0) {
            return res.json({
                deptScientists: result,
                dept,
                count: result.lenght,
            });
        }
        else {
            return res.json({errorMsg: `No results for department ${dept}`, dept})
        }
    }
    res.json({deptScientists: scientists, count: scientists.lenght});
});

// /api/scientists/:id
app.get("/api/scientists/:id/profile/:keyword", (req, res) => {
    const scientistId = parseInt(req.params.id, 10);
    const scientist = scientists.find(
        (scientist) => scientist.id === scientistId,
    );
    if(!scientist){
        return res.json({ success: false, errorMsg: "No scientist found."});
    }
    res.json({
        success: true,
        data: scientist,
    });
});

app.post("/api/initiatives", (req, res) => {
    const { title, budget, department } = req.body;
    const iniative = { title, budget, department };
    initiatives.push(iniative);
    res.json({ title, budget, department});
});


app.get("/about", (req, res) => {
    res.send("This is my WebApp Class project.")
});

app.post("/about",(req, res) => {
    res.send("This is still my WebApp Class project, but secure.")
});

app.get("/about",(req, res, next) => {
    ;
});

app.get('/weatherGDL', async (req, res) => {
  const respString = await getWeatherFrom(20.6597, -103.349, "Guadalajara");
  res.send(respString);
});

app.get('/weatherLSN', async (req, res) => {
  const respString = await getWeatherFrom(46.52, 6.63, "Lausanne");
  res.send(respString);
});

const cities = {
    GDL: { lat: 20.6597, long: -103.349, name: "Guadalajara" },
    LSN: { lat: 46.52, long: 6.63, name: "Lausanne"},
};

/*app.get("/weather/:city", async(req, res) => {
    try{
        const { city } = req.params;
        if (!city) throw new Error ("City code is required");
        if (!cities[city]) throw new Error("City code is invalid");
        const { lat, long, name } = cities[city];

        const respString = await getWeatherFrom(lat, long, name);
        res. send(respString);
    }
    catch (error) {
        console.error(error);
        if (error.message === "City code is required") {
            res.status(400).send({ error: "City code is required"});
        }
        res.status(500).send({ error: "Unknown error"});
    }
});*/
app.get("/weather/:city", async(req, res, next) => {
    const { city } = req.params;
    if (!city) 
        next(new Error ("City code is required"));
    if (!cities[city]) 
        next(new Error("City code is invalid"));
    const { lat, long, name } = cities[city];
    const respString = await getWeatherFrom(lat, long, name);
    res.send(respString);
});

/*app.all("*",(req, res, next) =>{
    next(new Error("Endpoint not found"));
});*/

app.use((err, req, res, next) => {
    console.error(err);
    const msg = err.message || err.rootCauseClass || "Unknown error";
    res
        .status(err.statusCode || 500)
        .json({ error: err.message, rootCause: err.rootCauseClass });
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
});

