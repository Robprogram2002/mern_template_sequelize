const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv").config();
const { sequelize } = require("./models");

// json parser
app.use(express.json());
// cors error preventions
app.use(cors());

// test route
app.get("/testing", (req, res) => {
  res.json("All ok");
});

app.listen(process.env.PORT || 3000, async () => {
  console.log("server running !! : http://localhost:3000");
  await sequelize.authenticate();
  console.log("database connetced succesfully !!");
});
