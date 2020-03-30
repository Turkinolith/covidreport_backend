const startupDebugger = require("debug")("app:startup");
const config = require("config");
const express = require("express");
const mongoose = require("mongoose");
const auth = require("./routes/auth");
const users = require("./routes/users");
const countries = require("./routes/countries");
const request = require("./models/request");
const savedate = require("./routes/savedates");
const app = express();

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);

///////////////////////////////////////////////
//! Essential Config and Environment Settings
///////////////////////////////////////////////
if (!config.get("mongoServer")) {
  console.error(
    "FATAL ERROR: mongoServer is not defined in config/default.json."
  );
  process.exit(1);
}

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined.");
  process.exit(1);
}

mongoose.connect(config.get("mongoServer"));

mongoose.connection
  .once("open", () => {
    console.log("connected to Mongo database");

    ///////////////////////////////////////////////////////////
    //* Settings for "disableUpdateOnLaunch" located in config
    //* If disable is true, don't run update on start. If disable is false, update on start

    if (!config.get("disableUpdateOnLaunch")) {
      request.runUpdate();
    } else {
      console.log("!! Disable Update on Launch: True !!");
    }
  })
  .on("error", error => {
    console.log("Error: ", error.message);
  });

////////////////////////////////////////////////////////////
//** Activate Express JSON parser & load up API endpoints */
////////////////////////////////////////////////////////////

app.use(express.json());
app.use("/api/countries", countries);
app.use("/api/savedates", savedate);
app.use("/api/users", users);
app.use("/api/auth", auth);

/////////////////////////////////
// * SET PORT AND START LISTENING
/////////////////////////////////
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}...`));
