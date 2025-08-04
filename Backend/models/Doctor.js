const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  name: String,
  specialization: String,
  availability: String,
  experience: String,
  image: String,
});

module.exports = mongoose.model("Doctor", doctorSchema);
