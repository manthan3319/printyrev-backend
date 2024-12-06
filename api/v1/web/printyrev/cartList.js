/**
 * This is Contain Save router/api.
 * @author Manthan Vaghasiya
 *
 */

const { Joi } = require("../../../../utilities/schemaValidate");
const { Router } = require("express");
const commonResolver = require("../../../../utilities/commonResolver");
const { cartList } = require("../../../../services/printyrev/printyrev");
const router = new Router();

/**
 * @swagger
 * /api/v1/printyrev/cartList:
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
 *           token:
 *             type: string
 *   responses:
 *    "200":
 *     description: success
 *    "400":
 *     description: fail
 *   security:
 *      - bearerAuth: []
 */

const dataSchema = Joi.object({
  token: Joi.string().required().label("token"),
});


router.post(
  "/cartList",
  commonResolver.bind({
    modelService: cartList,
    isRequestValidateRequired: true,
    schemaValidate: dataSchema,
  })
);

module.exports = router;
