require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("../src/config/db");
const Facility = require("../src/models/Facility");

// These are fictional demonstration records, not verified real facilities.
const demoFacilities = [
  {
    name: "Demo Community Pharmacy",
    type: "pharmacy",
    address: "Demo Street, Sample Ward",
    city: "Villupuram",
    state: "Tamil Nadu",
    phone: "0000000000",
    openingHours: "Demo hours: 9:00 AM - 9:00 PM",
    location: { type: "Point", coordinates: [79.49, 11.94] },
    verified: false,
    demoSeed: true
  },
  {
    name: "Demo Family Clinic",
    type: "clinic",
    address: "Sample Road, Demo Nagar",
    city: "Villupuram",
    state: "Tamil Nadu",
    phone: "0000000000",
    openingHours: "Demo hours: 10:00 AM - 6:00 PM",
    location: { type: "Point", coordinates: [79.50, 11.95] },
    verified: false,
    demoSeed: true
  },
  {
    name: "Demo General Hospital",
    type: "hospital",
    address: "Example Avenue, Sample Area",
    city: "Villupuram",
    state: "Tamil Nadu",
    phone: "0000000000",
    openingHours: "Demo listing; call for information",
    location: { type: "Point", coordinates: [79.48, 11.93] },
    verified: false,
    demoSeed: true
  }
];

async function seed() {
  try {
    await connectDB();
    await Facility.deleteMany({ demoSeed: true });
    const created = await Facility.insertMany(demoFacilities);
    console.log(`Inserted ${created.length} fictional demo facilities.`);
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seed();
