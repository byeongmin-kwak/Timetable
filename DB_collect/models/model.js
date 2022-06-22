const mongoose = require("mongoose");

  const TimeSchema = new mongoose.Schema({
    time: String,
    prof: String,
  });

  const SubSchema = new mongoose.Schema({
    campus: String,
    college: String,
    department: String,
    grade: String,
    name: String,
    credit: String,
    choice: String,
    subject: [TimeSchema]
  });

  const Subinfo = mongoose.model('Subinfo', SubSchema);
  module.exports = { Subinfo };