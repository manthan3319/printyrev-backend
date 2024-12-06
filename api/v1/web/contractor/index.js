/*
 * @file: index.js
 * @description: It's combine all contractor routers.
 * @author: Manthan Vaghasiya
 */

const save = require("./save");
const list = require("./list");
const edit = require("./edit");
const single = require("./single");
const deleteOne = require("./delete");

module.exports = [save, list, edit, single, deleteOne];
