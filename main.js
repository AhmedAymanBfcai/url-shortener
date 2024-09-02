const express = require("express");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = 4000;

app.use(bodyParser.json());

const dbMap = new Map();
const dbStats = new Map();

function generatesShortenedUrl(url) {
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
  const shortenedUrl = generatesShortenedUrl(url);

  const newEntry = {
    url,
    id,
    shortenedUrl,
    createdAt,
    updatedAt,
  };

  dbMap.set(shortenedUrl, newEntry);
  dbStats.set(shortenedUrl, { accessCount: 0 });

  res.send(newEntry);
});

app.listen(PORT, (req, res) => {
  console.log(`Server is up on port: ${PORT}`);
});
