const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");

// Import routes
const companyRoute = require("./routes/companies");
const userRoute = require("./routes/user");

dotenv.config();
// Connect to DB
mongoose.connect(
  process.env.DB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
  () => {
    console.log("Connected to DB!");
  }
);

// Middleware
app.use(express.json());

// Route Middlewares
app.use("/api/companies", companyRoute);
app.use("/api/users", userRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server Up and running"));
