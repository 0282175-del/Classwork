const express = require("express");
const path = require("node:path");

const app = express();

const names = [];
const tasks = [];
let lastGreeted = "";

app.set("views", path.join(__dirname, "html"));
app.set("view engine", "html");
app.engine("html", require("ejs").renderFile);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const parseIndex = (value) => {
  const index = Number(value);
  return Number.isInteger(index) ? index : -1;
};

app.get("/", (req, res) => {
  res.render("index", {
    names,
    tasks,
    message: lastGreeted ? `Hello, ${lastGreeted}!` : "",
  });
});

app.get("/greet", (req, res, next) => {
  if (req.query.name !== undefined) {
    const name = String(req.query.name).trim();

    if (!name) {
      return next(new Error("Name is required."));
    }

    names.push(name);
    lastGreeted = name;
    console.log("Registered name:", name);
    return res.redirect("/");
  }

  if (req.query.index !== undefined) {
    const index = parseIndex(req.query.index);

    if (index < 0 || index >= names.length) {
      return next(new Error("The selected person does not exist."));
    }

    return res.render("wazzup", { name: names[index] });
  }

  res.redirect("/");
});

app.post("/task", (req, res) => {
  const task = String(req.body.task ?? "").trim();

  if (task) {
    tasks.push(task);
  }

  res.redirect("/");
});

app.get("/task", (req, res) => {
  res.json(tasks);
});

app.post("/task/up/:index", (req, res) => {
  const index = parseIndex(req.params.index);

  if (index > 0 && index < tasks.length) {
    [tasks[index - 1], tasks[index]] = [tasks[index], tasks[index - 1]];
  }

  res.redirect("/");
});

app.post("/task/down/:index", (req, res) => {
  const index = parseIndex(req.params.index);

  if (index >= 0 && index < tasks.length - 1) {
    [tasks[index], tasks[index + 1]] = [tasks[index + 1], tasks[index]];
  }

  res.redirect("/");
});

app.post("/task/delete/:index", (req, res) => {
  const index = parseIndex(req.params.index);

  if (index >= 0 && index < tasks.length) {
    tasks.splice(index, 1);
  }

  res.redirect("/");
});

app.put("/greet/:name", (req, res) => {
  const name = req.params.name.trim();

  if (!name) {
    return res.status(400).json({ error: "Name is required." });
  }

  names.push(name);
  res.json(names);
});

app.use((err, req, res, next) => {
  console.error(err.message);

  res.status(400).render("index", {
    names,
    tasks,
    message: lastGreeted ? `Hello, ${lastGreeted}!` : "",
    error: err.message,
  });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
