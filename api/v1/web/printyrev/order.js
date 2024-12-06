/**
 * This is Contain Save router/api.
 * @author Manthan Vaghasiya
 *
 */

const { Joi } = require("../../../../utilities/schemaValidate");
const { Router } = require("express");
const commonResolver = require("../../../../utilities/commonResolver");
const { order } = require("../../../../services/printyrev/printyrev");
const router = new Router();

/**
 * @swagger
 * /api/v1/printyrev/order:
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
 *           country:
 *             type: string
 *           token:
 *             type: string
 *           state:
 *             type: string
 *           firstName:
 *             type: string
 *           lastName:
 *             type: string
 *           addressLine1:
 *             type: string
 *           addressLine2:
 *             type: string
 *           city:
 *             type: string
 *           postcode:
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
  country: Joi.string().required().label("country"),
  token: Joi.string().required().label("token"),
  state: Joi.string().required().label("state"),
  firstName: Joi.string().required().label("firstName"),
  postcode: Joi.string().required().label("postcode"),
  lastName: Joi.string().required().label("lastName"),
  addressLine1: Joi.string().required().label("addressLine1"),
  addressLine2: Joi.string().required().label("addressLine2"),
  city: Joi.string().required().label("city"),
});


router.post(
  "/order",
  commonResolver.bind({
    modelService: order,
    isRequestValidateRequired: true,
    schemaValidate: dataSchema,
  })
);

module.exports = router;
