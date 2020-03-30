const Papa = require("papaparse");
const fs = require("fs");
const mongoose = require("mongoose");
const { filepath } = require("../util/urlandfilepath");

const countrySchema = new mongoose.Schema({
  Province_State: {
    type: String
  },
  Country_Region: {
    type: String
  },
  Last_Update: {
    type: String
  },
  Confirmed: {
    type: Number
  },
  Deaths: {
    type: Number
  },
  Recovered: {
    type: Number
  },
  Lat: {
    type: Number
  },
  Long_: {
    type: Number
  },
  FIPS: {
    type: Number
  },
  Admin2: {
    type: String
  },
  Active: {
    type: Number
  },
  Combined_Key: {
    type: String
  }
});

const Countries = mongoose.model("Country", countrySchema);

function parseCountryFile() {
  return new Promise((resolve, reject) => {
    const readstream = fs.createReadStream(filepath);
    let data = "";

    readstream.on("data", function(chunk) {
      data += chunk;
    });

    return readstream.on("end", function() {
      Papa.parse(data, {
        header: true,
        delimiter: ",",
        //*** DEPRECATED - Header fixer that was needed prior to data source format change
        // transformHeader: function(h) {
        //   return h.replace(/Last\s+|\//g, ""); //Remove whitespace and forwardslashes from headers
        // },
        complete: function(results) {
          console.log("Errors in parse: ", results.errors);
          if (results.errors[0].row)
            results.data.splice(results.errors[0].row, 1);
          resolve(results.data);
        }
      });
    });
  });
}

exports.parseCountryFile = parseCountryFile;
exports.Countries = Countries;
