const cron = require("node-cron");
const { deleteotp } = require("../services/printyrev/printyrev");

cron.schedule("*/1 * * * *", async () => {
    deleteotp();
  });