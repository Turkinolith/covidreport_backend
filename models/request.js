const startupDebugger = require("debug")("app:startup");
const { parseCountryFile, Countries } = require("../models/country");
const download = require("./download.js");
const {
  todaysDateSearch,
  todaysDate,
  todaysURL,
  filepath
} = require("../util/urlandfilepath");
const { SaveDates } = require("./savedate");
const mongoose = require("mongoose");

async function runUpdate() {
  try {
    const datecheck = await SaveDates.find({
      SaveDate: { $gte: new Date(todaysDateSearch) }
    });
    startupDebugger("date is: ", datecheck, " today is: ", todaysDateSearch);
    if (datecheck.length >= 1)
      return console.log("DB already updated for today.");

    console.log("Attempting to download file");
    await download(todaysURL, filepath);
    console.log("Download Complete");
    console.log("Beginning CSV parse & upload to databse");
    try {
      // Start Session
      mongoose.startSession().then(session => {
        session.withTransaction(async () => {
          //Set Date
          let saves = new SaveDates({});

          //Parse country file & Save it
          let test = await parseCountryFile();
          test.forEach(async element => {
            let country = new Countries(element);
            country = await country.save();
          });
          // Save date
          saves = await saves.save();
        });
      });
      console.log("Upload complete");
    } catch (err) {
      console.log("CSV parse & upload failed: ", err.message);
    }
  } catch (e) {
    console.log("Download failed");
    console.log(e.message);
  }
}

exports.runUpdate = runUpdate;
