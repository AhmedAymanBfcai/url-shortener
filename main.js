const express = require("express");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = 4000;

app.use(bodyParser.json());

const dbMap = new Map();
const dbStats = new Map();

function generatesShortCode(url) {
  return Math.random().toString(36).substring(2, 8);
}

app.post("/shorten", (req, res) => {
  const { url } = req.body;

  if (!url) {
    res.status(400).json({ error: "URL is requried!" });
  }

  const id = uuidv4();
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;
  const shortCode = generatesShortCode(url);

  const newEntry = {
    url,
    id,
    shortCode,
    createdAt,
    updatedAt,
  };

  dbMap.set(shortCode, newEntry);
  dbStats.set(shortCode, { accessCount: 0 });

  res.send(newEntry);
});

app.put("/shorten/:shortCode", (req, res) => {
  const { url } = req.body;
  const { shortCode } = req.params;
  const entry = dbMap.get(shortCode);

  if (!entry) {
    res.status(404).json({ error: "Short URL not found" });
  }

  if (!url) {
    res.status(400).json({ error: "URL is requried!" });
  }

  entry.url = url;
  entry.updatedAt = new Date().toISOString();

  dbMap.set(shortCode, entry);

  res.send(entry);
  console.log(entry);
});

app.listen(PORT, (req, res) => {
  console.log(`Server is up on port: ${PORT}`);
});
