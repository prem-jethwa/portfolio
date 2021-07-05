require("./db/mongoose");
const express = require("express");
const cors = require("cors");
// const User = require("./model/user");
const app = express();

const port = process.env.PORT;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("test 1");
});

app.post("/", (req, res) => {
  try {
    const { message, name, email } = req.body;

    if (!message || !name || !email) throw new Error("invalid Inputs");

    const user = new User({ message, name, email });

    res.status(201).send(user);
  } catch (err) {
    res.status(400).send({ type: "error", message: err.message });
  }
});

app.listen(port, console.log);
