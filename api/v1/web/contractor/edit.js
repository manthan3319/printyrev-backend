/**
 * This is Contain Save router/api.
 * @author Manthan Vaghasiya
 *
 */

const { Router } = require("express");
const commonResolver = require("../../../../utilities/commonResolver");
const {
  updatecontractor,
} = require("../../../../services/contractor/contractor");
const router = new Router();

/**
 * @swagger
 * /api/v1/contractor/update:
 *  post:
 *   tags: ["Contractor"]
 *   summary: update Contractor information.
 *   description: api used for update Contractor information.
 *   parameters:
 *      - in: body
 *        name: lead
 *        description: update Contractor information.
 *        schema:
 *         type: object
 *         properties:
 *           firstName:
 *             type: string
 *           lastName:
 *             type: string
 *           contactorType:
 *             type: string
 *           companyName:
 *             type: string
 *           phone:
 *             type: string
 *           email:
 *             type: string
 *           micsConNotes:
 *             type: string
 *           address1:
 *             type: string
 *           address2:
 *             type: string
 *           city:
 *             type: string
 *           state:
 *             type: string
 *           zipcode:
 *             type: string
 *           country:
 *             type: string
 *           empIdentiNumber:
 *             type: string
 *           licenseInfo:
 *             type: string
 *           insureanceInfo:
 *             type: string
 *           bondInfo:
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
  "/update",
  commonResolver.bind({
    modelService: updatecontractor,
    isRequestValidateRequired: true,
  })
);

module.exports = router;
