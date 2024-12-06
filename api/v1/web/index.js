/*
 * @file: index.js
 * @description: It's combine all routers.
 * @author: Manthan Vaghasiya
 */
const { Router } = require("express");
const app = Router();

const contractor = require("./contractor");
const printyrev = require("./printyrev");

/*********** Combine all Routes ********************/
app.use("/contractor", contractor);
app.use("/printyrev", printyrev);

module.exports = app;
