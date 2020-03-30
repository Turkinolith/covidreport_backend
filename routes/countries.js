const { parseCountryFile, Countries } = require("../models/country");
const express = require("express");
const router = express.Router();
const request = require("../models/request");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const cors = require("cors");

////////////////////
//! [C]-RUD
////////////////////
//* Expected input format: {}

router.post("/", [auth, admin], async (req, res) => {
  try {
    const update = await request.runUpdate();
    if (!update) res.status(500).send("Unable to get update!");
    res.send(update);
  } catch (ex) {
    res.status(500).send(ex.message);
  }
});

////////////////////
//! C-[R]-UD
////////////////////

//! *** Returns all entries ***
//* Also sorts entries by CountryRegion
router.get("/", cors(), async (req, res) => {
  try {
    console.log("Country get request obtained.");
    const countries = await Countries.find().sort("CountryRegion");
    res.send(countries);
  } catch (err) {
    res.status(500).send("Error getting country list");
  }
});

//! *** Returns confirmed entries ***
//* Also sorts entries by CountryRegion
router.get("/conf", cors(), async (req, res) => {
  try {
    console.log("Country get request obtained.");
    const countries = await Countries.find({ Confirmed: { $gte: 1 } }).sort(
      "CountryRegion"
    );
    res.send(countries);
  } catch (err) {
    res.status(500).send("Error getting country list");
  }
});

////////////////////////
//! Exports
////////////////////////
module.exports = router;
