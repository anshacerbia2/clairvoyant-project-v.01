const router = require("express").Router();
const AirportListController = require("../controllers/AirportListController");

router.get("/", AirportListController.fetchAirports);

module.exports = router;
