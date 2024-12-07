/**
 * This is Contain Save router/api.
 * @author Manthan Vaghasiya
 *
 */

const { Joi } = require("../../../../utilities/schemaValidate");
const { Router } = require("express");
const commonResolver = require("../../../../utilities/commonResolver");
const { addRazorpayPayment } = require("../../../../services/printyrev/printyrev");
const router = new Router();

/**
 * @swagger
 * /api/v1/printyrev/addRazorpayPayment:
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
 *           amount:
 *             type: string
 *           currency:
 *             type: string
 *           receipt:
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
  amount: Joi.string().required().label("amount"),
  currency: Joi.string().required().label("currency"),
  receipt: Joi.string().required().label("receipt"),
});


router.post(
  "/addRazorpayPayment",
  commonResolver.bind({
    modelService: addRazorpayPayment,
    isRequestValidateRequired: true,
    schemaValidate: dataSchema,
  })
);

module.exports = router;
