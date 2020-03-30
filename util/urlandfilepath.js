const startupDebugger = require("debug")("app:startup");
const path = require("path");

const urlBase =
  "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/";

//* Construct "Today's" file path
/////////////////////////////////////////////////////////
let date_ob = new Date();

// current date
// adjust 0 before single digit date
//let date = ("0" + date_ob.getDate()).slice(-2);
let date = "25";

// current month
let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

// current year
let year = date_ob.getFullYear();

//* prints date in MM-DD-YYYY format
let todaysDate = month + "-" + date + "-" + year;
console.log("Today is: ", todaysDate);
let todaysFileName = month + "-" + date + "-" + year + ".csv";

//* Todays date in format for DB searching
let todaysDateSearch = year + "," + month + "," + date;
/////////////////////////////////////////////////////////

//* Sets file save path
const filepath = path.join(__dirname, "../data/", todaysFileName);
startupDebugger("Save path is: ", filepath);

//* Generates todays URL for the download.
let todaysURL = urlBase + month + "-" + date + "-" + year + ".csv";
startupDebugger("Download path is: ", todaysURL);
/////////////////////////////////////////////////////////

exports.filepath = filepath;
exports.todaysDate = todaysDate;
exports.todaysURL = todaysURL;
exports.todaysDateSearch = todaysDateSearch;
