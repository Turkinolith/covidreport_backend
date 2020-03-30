const { SaveDates } = require("../models/savedate");
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

////////////////////
//! [C]-RUD
////////////////////
//* Expected input format: {}

router.post("/", [auth, admin], async (req, res) => {
  try {
    let saves = new SaveDates({});
    saves = await saves.save();
    res.send(saves);
  } catch (ex) {
    res.status(500).send(ex.message);
  }
});

////////////////////
//! C-[R]-UD
////////////////////

//! *** Returns all save dates ***
router.get("/", async (req, res) => {
  try {
    const dates = await SaveDates.find();
    res.send(dates);
  } catch (err) {
    res.status(500).send("Error getting save date list");
  }
});

////////////////////////
//! Exports
////////////////////////
module.exports = router;
