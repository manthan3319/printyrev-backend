/*
 * @file: index.js
 * @description: It's combine all routers.
 * @author: Manthan Vaghasiya
 */

// Please assign all url here related WEB api's
const { Router } = require("express");
const webV1 = require("./v1/web");
/*********** Combine all Routes ********************/

const app = Router();

app.use("/v1", webV1);

module.exports = app;
