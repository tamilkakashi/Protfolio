const express = require("express");
const {
  listFacilities,
  getNearbyFacilities,
  getFacilityById
} = require("../controllers/facilityController");

const router = express.Router();

router.get("/", listFacilities);
router.get("/nearby", getNearbyFacilities);
router.get("/:id", getFacilityById);

module.exports = router;
