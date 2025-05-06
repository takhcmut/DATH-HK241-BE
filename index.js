const express = require("express");
require("dotenv").config();

const bodyParser = require("body-parser");

const cors = require("cors");
const cookieParser = require("cookie-parser");

const database = require("./config/database");

const adminRoutes = require("./api/v1/routes/admin/index.route");
const clientRoutes = require("./api/v1/routes/client/index.route");
const sellerRoutes = require("./api/v1/routes/seller/index.route");

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());
app.use(cookieParser());


const corsOption = {
  allowedHeaders: ["authorization", "Content-Type"], // you can change the headers
  exposedHeaders: ["authorization"], // you can change the headers
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  credentials: true, 
};
app.use(
  cors(corsOption)
);
app.options("*", cors(corsOption));


// Database
database.connect();

// Routes

adminRoutes(app);
clientRoutes(app);
sellerRoutes(app);

// Listen
app.listen(port, () => {
  console.log(`App listen on port ${port}`);
})
