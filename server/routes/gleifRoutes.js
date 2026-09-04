const express = require("express");
const axios = require("axios");

const router = express.Router();

router.get("/search", async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Please provide a company search query",
      });
    }

    const response = await axios.get(
      "https://api.gleif.org/api/v1/lei-records",
      {
        params: {
          "filter[entity.legalName]": query.trim(),
          page: {
            size: 10,
          },
        },
      }
    );

    const records = response.data?.data || [];

    const companies = records.map((record) => {
      const attributes = record.attributes || {};
      const entity = attributes.entity || {};
      const legalAddress = entity.legalAddress || {};

      return {
        lei: record.id || "",
        company: entity.legalName?.name || "",
        country: legalAddress.country || "",
        city: legalAddress.city || "",
        address: [
          legalAddress.addressLines?.join(", "),
          legalAddress.city,
          legalAddress.region,
          legalAddress.country,
          legalAddress.postalCode,
        ]
          .filter(Boolean)
          .join(", "),
        status: attributes.entity?.status || "",
        registrationStatus: attributes.registration?.status || "",
      };
    });

    res.status(200).json({
      success: true,
      count: companies.length,
      data: companies,
    });
  } catch (error) {
    console.error("GLEIF API ERROR:");
    console.error(error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch company data from GLEIF",
      error: error.message,
    });
  }
});

module.exports = router;