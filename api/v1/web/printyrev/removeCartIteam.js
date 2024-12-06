/**
 * This is Contain Save router/api.
 * @author Manthan Vaghasiya
 *
 */

const { Joi } = require("../../../../utilities/schemaValidate");
const { Router } = require("express");
const commonResolver = require("../../../../utilities/commonResolver");
const { removeCartIteam } = require("../../../../services/printyrev/printyrev");
const router = new Router();

/**
 * @swagger
 * /api/v1/printyrev/removeCartIteam:
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
 *           productId:
 *             type: string
 *           color:
 *             type: string
 *           size:
 *             type: string
 *           cartid:
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
  productId: Joi.string().required().label("productId"),
  color: Joi.string().required().label("color"),
  size: Joi.string().required().label("size"),
  cartid: Joi.string().required().label("cartid"),
});


router.post(
  "/removeCartIteam",
  commonResolver.bind({
    modelService: removeCartIteam,
    isRequestValidateRequired: true,
    schemaValidate: dataSchema,
  })
);

module.exports = router;
