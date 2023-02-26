const router = require("express").Router();
const airportListRoutes = require("./airportList");

router.use("/airport-list", airportListRoutes);
module.exports = router;
