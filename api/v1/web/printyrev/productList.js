/**
 * This is Contain Save router/api.
 * @author Manthan Vaghasiya
 *
 */

const { Router } = require("express");
const commonResolver = require("../../../../utilities/commonResolver");
const { productList } = require("../../../../services/printyrev/printyrev");
const router = new Router();

/**
 * @swagger
 * /api/v1/printyrev/productList:
 *  post:
 *   tags: ["printyrev"]
 *   summary: get printyrev information.
 *   description: api used for get printyrev information.
 *   parameters:
 *      - in: body
 *        name: lead
 *        description: Save Contractor information.
 *        schema:
 *         type: object
 *         properties:
 *   responses:
 *    "200":
 *     description: success
 *    "400":
 *     description: fail
 *   security:
 *      - bearerAuth: []
 */

router.post(
  "/productList",
  commonResolver.bind({
    modelService: productList
  })
);

module.exports = router;
