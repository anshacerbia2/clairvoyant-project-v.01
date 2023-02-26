const { AirportList } = require("../models");

class AirportListController {
  static async fetchAirports(request, response, next) {
    try {
      const AIRPORT_LIST = await AirportList.findAll();
      response.status(200).json(AIRPORT_LIST);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AirportListController;
