const path = require("path");

// packages
const express = require("express");
const app = express();
const cors = require("cors");
const multer = require("multer");
const morgan = require("morgan");

// database imports
const { sequelize } = require("./models");

// laoding .env file
const dotenv = require("dotenv").config();

// routes
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");

// json parser
app.use(express.json());
// cors error preventions
app.use(cors());
// consol.log request info
process.env.NODE_ENV == "development" && app.use(morgan("combined"));

// file upload configuration
const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    // where the files are storaged
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    // how each file will be named
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + "-" + file.originalname);
  },
});

// filter files configurations
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    // pass the file
    cb(null, true);
  } else {
    // reject the file
    cb(null, false);
  }
};

// we can use the upload object to handle file uploads only in specific routes and
// not as a general middleware
const upload = multer({ storage: fileStorage, fileFilter: fileFilter });

// file handle middleware
app.use(upload.single("image"));
app.use("/images", express.static(path.join(__dirname, "images")));

// main routes
app.use(userRoutes);
app.use("/post", postRoutes);

// error middleware
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

const main = async () => {
  const server = app.listen(process.env.PORT || 3000, async () => {
    console.log("server running !! : http://localhost:3000");
    await sequelize.authenticate();
    console.log("database connetced succesfully !!");

    const io = require("./socket").init(server);
    io.on("connection", (socket) => {
      console.log("Client connected");
      console.log(socket);
    });
  });
};

main();
