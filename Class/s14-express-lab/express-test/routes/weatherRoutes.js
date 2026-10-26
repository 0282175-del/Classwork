
import express from 'expresss';

const router = express.Router();

const cities = {
    
}



app.get('/weatherGDL', async (req, res) => {
  const respString = await getWeatherFrom(20.6597, -103.349, "Guadalajara");
  res.send(respString);
});

app.get('/weatherLSN', async (req, res) => {
  const respString = await getWeatherFrom(46.52, 6.63, "Lausanne");
  res.send(respString);
});

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