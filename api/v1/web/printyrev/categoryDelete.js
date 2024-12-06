/**
 * This is Contain Save router/api.
 * @author Manthan Vaghasiya
 *
 */

const { Joi } = require("../../../../utilities/schemaValidate");
const { Router } = require("express");
const commonResolver = require("../../../../utilities/commonResolver");
const { categoryDelete } = require("../../../../services/printyrev/printyrev");
const router = new Router();

/**
 * @swagger
 * /api/v1/printyrev/categoryDelete:
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
 *           categoryId:
 *             type: string
 *   responses:
 *    "200":
 *     description: success
 *    "400":
 *     description: fail
 */

const dataSchema = Joi.object({
  categoryId: Joi.string().required().label("categoryId"),
});

router.post(
  "/categoryDelete",
  commonResolver.bind({
    modelService: categoryDelete,
    schemaValidate: dataSchema,
  })
);

module.exports = router;
