const Joi = require("@hapi/joi");
Joi.objectId = require("joi-objectid")(Joi);
const { createValidator } = require("express-joi-validation");
const validator = createValidator({ passError: true });
module.exports = { Joi, validator };
