import express from "express";

const app = express();
const port = 5000;

app.get("/", (_req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
