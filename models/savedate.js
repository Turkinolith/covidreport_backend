const mongoose = require("mongoose");

const savedateSchema = new mongoose.Schema({
  SaveDate: {
    type: Date,
    required: true,
    default: Date.now
  }
});

const SaveDates = mongoose.model("SaveDate", savedateSchema);

exports.SaveDates = SaveDates;
