const fs = require("node:fs");
const sw = require("star-wars-quotes");
const superheroes = require("superheroes");
const supervillains = require("supervillains");

console.log("Hello, world!");
console.log(sw());
console.log(`${superheroes.random()} vs ${supervillains.random()}!`);
console.log(fs.readFileSync("./data/input.txt", "utf8").trim());
