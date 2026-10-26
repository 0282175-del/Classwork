const express = require("express");
const https = require("https");
const path = require("node:path");
require("dotenv").config();

const app = express();
const PORT = 3000;
const API_KEY = process.env.OPENWEATHER_API_KEY;

app.use(express.urlencoded({ extended: true }));

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const renderPage = (title, content) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
</head>
<body>
    ${content}
    <p><a href="/">Back to home</a></p>
</body>
</html>`;

const renderError = (message) =>
  renderPage("Weather error", `<h1>Could not get the weather</h1><p>${escapeHtml(message)}</p>`);

const renderWeather = ({ city, country, temperature, description, icon }) =>
  renderPage(
    "Weather report",
    `<h1>${escapeHtml(city)}${country ? `, ${escapeHtml(country)}` : ""}</h1>
    <p>Temperature: ${escapeHtml(temperature)} °C</p>
    <p>Description: ${escapeHtml(description)}</p>
    <img src="http://openweathermap.org/img/wn/${encodeURIComponent(icon)}@2x.png" alt="${escapeHtml(description)}">`
  );

const getWeather = (city) =>
  new Promise((resolve, reject) => {
    const url = new URL("https://api.openweathermap.org/data/2.5/weather");
    url.searchParams.set("q", city);
    url.searchParams.set("appid", API_KEY);
    url.searchParams.set("units", "metric");

    const request = https.get(url, (response) => {
      let rawData = "";

      response.on("data", (chunk) => {
        rawData += chunk;
      });

      response.on("end", () => {
        let data;

        try {
          data = JSON.parse(rawData);
        } catch {
          return reject(new Error("OpenWeather returned an invalid response."));
        }

        if (response.statusCode !== 200 || Number(data.cod) !== 200) {
          const statusCode = response.statusCode >= 400 && response.statusCode < 500
            ? response.statusCode
            : 502;

          return reject(Object.assign(
            new Error(data.message || `OpenWeather returned status ${response.statusCode}.`),
            { statusCode }
          ));
        }

        resolve(data);
      });

      response.on("error", () => {
        reject(new Error("The connection to OpenWeather failed."));
      });
    });

    request.on("error", () => {
      reject(new Error("Could not connect to OpenWeather."));
    });
  });

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/", async (req, res) => {
  const city = String(req.body.cityName ?? "").trim();

  if (!city) {
    return res.status(400).send(renderError("Please enter a city name."));
  }

  if (!API_KEY) {
    return res.status(500).send(renderError("The OpenWeather API key is not configured."));
  }

  try {
    const weather = await getWeather(city);
    const condition = weather.weather?.[0] ?? {};

    res.send(renderWeather({
      city: weather.name || city,
      country: weather.sys?.country,
      temperature: weather.main?.temp,
      description: condition.description || "No description available",
      icon: condition.icon || "",
    }));
  } catch (error) {
    res.status(error.statusCode || 502).send(renderError(error.message));
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
