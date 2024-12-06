/**
 * This is Contain Save router/api.
 * @author Manthan Vaghasiya
 *
 */

const { Joi } = require("../../../../utilities/schemaValidate");
const { Router } = require("express");
const commonResolver = require("../../../../utilities/commonResolver");
const { getCategory } = require("../../../../services/printyrev/printyrev");
const router = new Router();

/**
 * @swagger
 * /api/v1/printyrev/getCategory:
 *  post:
 *   tags: ["printyrev"]
 *   summary: Save printyrev information.
 *   description: api used for Save printyrev information.
 *   parameters:
 *      - in: body
 *        name: lead
 *        description: Save printyrev information.
 *        schema:
 *         type: object
 *         properties:
 *   responses:
 *    "200":
 *     description: success
 *    "400":
 *     description: fail
 */



router.post(
  "/getCategory",
  commonResolver.bind({
    modelService: getCategory,
  })
);

module.exports = router;
