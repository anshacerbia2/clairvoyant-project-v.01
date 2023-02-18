if (process.env.NODE_ENV !== "production") require("dotenv").config();

const express = require("express");
const app = express();
const port = process.env.port || 4002;
const cors = require("cors");
const axios = require("axios");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extends: false }));
// app.use(router);

const GDS_URL = "https://test.api.amadeus.com/v2";
app.get("/flight-service/airport-list", async (request, response) => {
  try {
    const GDS_AUTH = new URLSearchParams();
    GDS_AUTH.append("grant_type", "client_credentials");
    GDS_AUTH.append("client_id", "Ez2B37fYoSAS7Rsb3DqHI7TlwXrd4Gzm");
    GDS_AUTH.append("client_secret", "bvyQRIeCwIfl5QET");
    const RES_GDS_AUTH = await axios.post(
      "https://test.api.amadeus.com/v1/security/oauth2/token",
      GDS_AUTH,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    const RES_DATA = await axios.get(
      `${GDS_URL}/shopping/flight-offers?originLocationCode=CGK&destinationLocationCode=SUB&departureDate=2023-05-02&adults=1&nonStop=false&max=250`,
      {
        headers: {
          Authorization: `Bearer ${RES_GDS_AUTH.data.access_token}`,
        },
      }
    );
    response.status(RES_DATA.status).json(RES_DATA.data);
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => console.log("Server running on port", port));
