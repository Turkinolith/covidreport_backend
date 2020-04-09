const startupDebugger = require("debug")("app:startup");
const { parseCountryFile, Countries } = require("../models/country");
const download = require("./download.js");
const {
  todaysDateSearch,
  todaysDate,
  todaysURL,
  yesterdayURL,
  filepath,
} = require("../util/urlandfilepath");
const { SaveDates } = require("./savedate");
const mongoose = require("mongoose");
const urlExist = require("url-exist");

//* if today exists, return false
//* if yesterday exists, return true
//* if today AND yesterday does NOT exist, throw Error.
async function testURL(today, yesterday) {
  try {
    let todayExists = await urlExist(today);
    let yesterdayExists = await urlExist(yesterday);
    if (!todayExists) {
      console.log("Todays URL invalid, checking yesterdays URL. ", +yesterday);
      if (!yesterdayExists) {
        throw new Error("URL's invalid for today and yesterday!");
      }
      return true;
    }
    return false;
  } catch (err) {
    throw err;
  }
}

async function runUpdate() {
  try {
    const datecheck = await SaveDates.find({
      SaveDate: { $gte: new Date(todaysDateSearch) },
    });
    startupDebugger("date is: ", datecheck, " today is: ", todaysDateSearch);
    if (datecheck.length >= 1)
      return console.log("DB already updated for today.");

    //*Backup Day Logic
    let tryYesterday = false;
    tryYesterday = testURL(todaysURL, yesterdayURL);

    console.log("Attempting to download file");
    if (tryYesterday) await download(yesterdayURL, filepath);
    else await download(todaysURL, filepath);
    console.log("Download Complete");
    console.log("Beginning CSV parse & upload to databse");
    try {
      // Start Session
      mongoose.startSession().then((session) => {
        session.withTransaction(async () => {
          //Set Date
          let saves = new SaveDates({});

          //Delete Old Data
          await Countries.deleteMany({});

          //Parse country file & Save it
          let test = await parseCountryFile();
          test.forEach(async (element) => {
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
exports.testURL = testURL;
