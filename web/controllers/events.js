const { v4: uuidv4 } = require("uuid");

const redisClient = require("../config/redis");

const HOLD_DEFAULT = 60; // In seconds

// Create event with given number of seats
// Each event will be indentified with UUID
const createEvent = (req, res) => {
  const { totalSeats } = req.body;

  if (!totalSeats || totalSeats < 10 || totalSeats > 1000) {
    return res
      .status(400)
      .json({ message: "Total seats must be between 10 and 1,000 (included)" });
  }

  let id = uuidv4();

  // Set all seats to available
  const seats = {};
  for (let i = 1; i <= totalSeats; i++) {
    seats[`seat:${i}`] = "available";
  }

  redisClient.hmset(`event:${id}`, seats, (err, reply) => {
    if (err)
      return res.status(500).send({
        error: err.message,
      });
    res.status(201).json({
      id,
      totalSeats,
    });
  });
};

const getEventSeats = (req, res) => {
  const eventId = req.params.eventId;
  redisClient.hgetall(`event:${eventId}`, (err, seats) => {
    if (err) return res.status(500).send(err);
    // Filter only available seats
    const availableSeats = Object.keys(seats).filter(
      (seat) => seats[seat] === "available"
    );
    return res.status(200).json(availableSeats);
  });
};

// Initially used to create event with random number of seats
const randomSeats = () => Math.round(Math.random() * (1000 - 10) + 10);

module.exports = {
  createEvent,
  getEventSeats,
};
