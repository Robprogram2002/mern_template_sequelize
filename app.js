// packages
const express = require("express");
const app = express();
const cors = require("cors");

// database imports
const { sequelize } = require("./models");

// laoding .env file
const dotenv = require("dotenv").config();

// routes
const userRoutes = require("./routes/userRoutes");

// json parser
app.use(express.json());
// cors error preventions
app.use(cors());

// test route
// app.get("/testing", (req, res) => {
//   res.json("All ok");
// });

// main routes
app.use(userRoutes);

// error middleware
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

app.listen(process.env.PORT || 3000, async () => {
  console.log("server running !! : http://localhost:3000");
  await sequelize.authenticate();
  console.log("database connetced succesfully !!");
});
