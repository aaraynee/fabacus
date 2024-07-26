const express = require("express");
const router = express.Router();
const reservations = require("../controllers/reservations");

router.post("/event/:eventId/hold", reservations.holdSeat);
router.post("/event/:eventId/reserve", reservations.reserveSeat);
// Bonus: Refresh hold on seat
router.post("/event/:eventId/refresh", reservations.refreshSeat);

module.exports = router;
