/*
 * @file: swagger-config.js
 * @description: It Contain swagger configrations.
 * @author: Manthan Vaghasiya
 */
const swaggerJsDocs = require("swagger-jsdoc");

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "My Project Api's Documentations",
      version: "1.0",
      description: "All api end points",
      contact: {
        name: "Manthan Vaghasiya",
      },
      servers: ["http://localhost:3000"],
    },
    securityDefinitions: {
      bearerAuth: {
        type: "apiKey",
        name: "authorization",
        scheme: "bearer",
        in: "header",
      },
    },
    produces: ["application/json"],
  },
  apis: ["./api/v1/web/*/*.js"],
};
module.exports = swaggerJsDocs(swaggerOptions);
