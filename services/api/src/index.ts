import express from "express";

const app = express();

app.use(express.json());

app.post("/msg", (req, res) => {
  console.log("Message received");
  res.status(200).send("Message received");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
