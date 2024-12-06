/*
 * @file: app.js
 * @description: It Contain server setup functions.
 * @author: Manthan Vaghasiya
 */

require("dotenv").config({ path: ".env" });
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const logger = require("morgan");
const db = require("./db/index");
const swaggerJsDocsWeb = require("./config/swagger/swagger-config-web");
const { failAction } = require("./utilities/response");
require("./cron/cronjob");
/**Start import routes */
const webRoutes = require("./api/index");
/**End import routes */

const env = process.env.NODE_ENV ? process.env.NODE_ENV : "dev";
const port = process.env.PORT ? process.env.PORT : 7000;
const app = express();
app.use("/images", express.static(path.join(__dirname, "images")));

// Access-Control-Allow-Origin
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

app.use(logger("dev"));

app.use(
  bodyParser.json({
    limit: "50mb",
  })
);

app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    parameterLimit: 100000,
    extended: true,
  })
);

// app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));

var options = {};

app.use(
  "/web-api-docs",
  swaggerUi.serveFiles(swaggerJsDocsWeb, options),
  swaggerUi.setup(swaggerJsDocsWeb)
);

/*********** All Routes ********************/

app.use("/api", webRoutes);
app.use((err, req, res, next) => {
  if (err && err.error && err.error.isJoi) {
    // we had a joi error, let's return a custom 400 json response
    res
      .status(400)
      .json(failAction(err.error.message.toString().replace(/[\""]+/g, "")));
  } else {
    // pass on to another error handler
    next(err);
  }
});

process.on("uncaughtException", (err) => {
  console.log(`Uncaught Exception: ${err.message}`);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.log("Unhandled rejection at ", promise, `reason: ${err.message}`);
  process.exit(1);
});

app.get("/", (req, res) =>
  res.send(`<h1>Resimpli App ${env} environment</h1>`)
);

app.get("/test", (req, res) =>
  res.send("<h2>Hello Admin <br> How Are You ?</h2>")
);

app.listen(port, function () {
  console.log(
    `Express server listening on port ${port} and worker ${process.pid}`
  );
});
