/*
 * @file: index.js
 * @description: It Contain db setup function.
 * @author: Manthan Vaghasiya
 */
require("dotenv").config({ path: ".env" });
const mongoose = require("mongoose");

/* development connection string */
const databaseUrl = process.env.ATLAS_URL;

// console.log("DB URL:", databaseUrl);
// Mongoose setup with server
mongoose.set("strictQuery", false);
mongoose.connect(
  databaseUrl,
  {
    // useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useFindAndModify: false,
  },
  (err) => {
    if (err) {
      console.log("database not connected", err);
    } else {
      console.log("database connected");
    }
  }
);

module.exports = mongoose;
