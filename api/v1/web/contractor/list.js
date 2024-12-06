/**
 * This is Contain Save router/api.
 * @author Manthan Vaghasiya
 *
 */

const { Router } = require("express");
const commonResolver = require("../../../../utilities/commonResolver");
const { getcontractor } = require("../../../../services/contractor/contractor");
const router = new Router();

/**
 * @swagger
 * /api/v1/contractor/getcontractor:
 *  post:
 *   tags: ["Contractor"]
 *   summary: get Contractor information.
 *   description: api used for get Contractor information.
 *   parameters:
 *      - in: body
 *        name: lead
 *        description: get Contractor information.
 *        schema:
 *         type: object
 *         properties:
 *           contractorType:
 *             type: string
 *           page:
 *             type: string
 *           limit:
 *             type: string
 *   responses:
 *    "200":
 *     description: success
 *    "400":
 *     description: fail
 *   security:
 *      - bearerAuth: []
 */

router.post(
  "/getcontractor",
  commonResolver.bind({
    modelService: getcontractor,
    isRequestValidateRequired: true,
  })
);

module.exports = router;
