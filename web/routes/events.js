const express = require("express");
const router = express.Router();
const events = require("../controllers/events");

router.post("/", events.createEvent);
router.get("/:eventId/seats", events.getEventSeats);

module.exports = router;
