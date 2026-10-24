const mongoose = require("mongoose");

const facilitySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  type: {
    type: String,
    required: true,
    enum: ["clinic", "hospital", "pharmacy"],
    index: true
  },
  address: { type: String, required: true, trim: true, maxlength: 240 },
  city: { type: String, required: true, trim: true, maxlength: 100, index: true },
  state: { type: String, required: true, trim: true, maxlength: 100 },
  phone: { type: String, trim: true, maxlength: 30, default: "" },
  openingHours: { type: String, trim: true, maxlength: 120, default: "Please contact facility" },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
      default: "Point"
    },
    coordinates: {
      type: [Number],
      required: true,
      validate: {
        validator: (coordinates) => Array.isArray(coordinates) &&
          coordinates.length === 2 &&
          coordinates.every(Number.isFinite) &&
          coordinates[0] >= -180 && coordinates[0] <= 180 &&
          coordinates[1] >= -90 && coordinates[1] <= 90,
        message: "location.coordinates must be [longitude, latitude]"
      }
    }
  },
  verified: { type: Boolean, default: false },
  demoSeed: { type: Boolean, default: false }
}, { timestamps: true });

facilitySchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Facility", facilitySchema);
