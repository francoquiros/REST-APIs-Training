const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  rate: {
    type: String,
    required: true
  },
  hours: {
    type: String,
    required: true
  },
  isCertified: {
    type: Boolean,
    required: true
  },
  image: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Company", companySchema);
