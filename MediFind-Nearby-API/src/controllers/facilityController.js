const mongoose = require("mongoose");
const Facility = require("../models/Facility");

const FACILITY_TYPES = new Set(["clinic", "hospital", "pharmacy"]);

function escapeRegex(value) {
  const regexMeta = new Set([".", "*", "+", "?", "^", "$", "{", "}", "(", ")", "|", "[", "]", "\\\\"]);
  return value.split("").map((character) => regexMeta.has(character) ? "\\\\" + character : character).join("");
}

function parsePositiveInteger(value, fallback, max) {
  if (value === undefined) return fallback;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) return null;
  return Math.min(parsed, max);
}

async function listFacilities(req, res, next) {
  try {
    const page = parsePositiveInteger(req.query.page, 1, 1000000);
    const limit = parsePositiveInteger(req.query.limit, 10, 50);
    if (!page || !limit) {
      return res.status(400).json({ error: "page and limit must be positive integers." });
    }

    const filter = {};
    if (req.query.type) {
      const type = String(req.query.type).toLowerCase();
      if (!FACILITY_TYPES.has(type)) {
        return res.status(400).json({ error: "type must be clinic, hospital, or pharmacy." });
      }
      filter.type = type;
    }
    if (req.query.city) {
      filter.city = new RegExp(escapeRegex(String(req.query.city).slice(0, 100)), "i");
    }
    if (req.query.search) {
      const term = escapeRegex(String(req.query.search).slice(0, 100));
      filter.$or = [
        { name: new RegExp(term, "i") },
        { address: new RegExp(term, "i") },
        { city: new RegExp(term, "i") }
      ];
    }

    const [items, total] = await Promise.all([
      Facility.find(filter)
        .select("-__v -demoSeed")
        .sort({ name: 1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Facility.countDocuments(filter)
    ]);

    res.json({
      data: items,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    next(error);
  }
}

async function getNearbyFacilities(req, res, next) {
  try {
    const lat = Number(req.query.lat);
    const lng = Number(req.query.lng);
    const radiusKm = req.query.radiusKm === undefined ? 10 : Number(req.query.radiusKm);

    if (req.query.lat === undefined || req.query.lng === undefined ||
        !Number.isFinite(lat) || !Number.isFinite(lng) ||
        lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return res.status(400).json({ error: "Provide valid lat (-90..90) and lng (-180..180)." });
    }
    if (!Number.isFinite(radiusKm) || radiusKm <= 0 || radiusKm > 100) {
      return res.status(400).json({ error: "radiusKm must be greater than 0 and at most 100." });
    }

    const filter = {
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [lng, lat] },
          $maxDistance: radiusKm * 1000
        }
      }
    };
    if (req.query.type) {
      const type = String(req.query.type).toLowerCase();
      if (!FACILITY_TYPES.has(type)) {
        return res.status(400).json({ error: "type must be clinic, hospital, or pharmacy." });
      }
      filter.type = type;
    }

    const items = await Facility.find(filter)
      .select("-__v -demoSeed")
      .limit(50)
      .lean();

    res.json({ data: items, count: items.length, radiusKm });
  } catch (error) {
    next(error);
  }
}

async function getFacilityById(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "Invalid facility ID." });
    }
    const facility = await Facility.findById(req.params.id)
      .select("-__v -demoSeed")
      .lean();
    if (!facility) return res.status(404).json({ error: "Facility not found." });
    res.json({ data: facility });
  } catch (error) {
    next(error);
  }
}

module.exports = { listFacilities, getNearbyFacilities, getFacilityById };
