const { v4: uuidv4 } = require("uuid");
const moment = require("moment");

const redisClient = require("../config/redis");

// In milliseconds, again this is something we could move into .env
const HOLD_DEFAULT = 60000;

const holdSeat = (req, res) => {
  const eventId = req.params.eventId;
  const seatId = req.body.seatId;
  const userId = req.body.userId;

  // Create a timestamp so we can remember when a hold was set
  // This will be used later on to make sure we don't lose the hold
  // if we refresh a hold on a seat
  const timestamp = moment().format();

  redisClient.hget(`event:${eventId}`, seatId, (err, seatStatus) => {
    if (err) return res.status(500).send(err);
    if (seatStatus !== "available")
      return res.status(400).send({ message: "Seat is not available" });

    return holdSeatHelper({ res, eventId, seatId, userId, timestamp });
  });
};

const reserveSeat = (req, res) => {
  const eventId = req.params.eventId;
  const seatId = req.body.seatId;
  const userId = req.body.userId;

  redisClient.hget(`event:${eventId}`, seatId, (err, seatStatus) => {
    if (err) return res.status(500).send(err);
    if (!seatStatus.includes(`hold:${userId}`))
      return res.status(400).send({ message: "Seat is not available" });

    redisClient.hset(
      `event:${eventId}`,
      seatId,
      `reserved:${userId}`,
      (err, result) => {
        if (err) return res.status(500).send(err);
        return res.status(200).send({ message: "Seat reserved" });
      }
    );
  });
};

const refreshSeat = (req, res) => {
  const eventId = req.params.eventId;
  const seatId = req.body.seatId;
  const userId = req.body.userId;
  const timestamp = moment().format();

  redisClient.hget(`event:${eventId}`, seatId, (err, seatStatus) => {
    if (err) return res.status(500).send(err);
    if (!seatStatus.includes(`hold:${userId}`))
      return res.status(400).send({ message: "Seat can't be refreshed" });

    return holdSeatHelper({ res, eventId, seatId, userId, timestamp });
  });
};

// Helper for holding the seat and setting it back to available after hold time
const holdSeatHelper = async ({
  res,
  eventId,
  seatId,
  userId,
  timestamp,
  limit = 1,
}) => {
  redisClient.hgetall(`event:${eventId}`, (err, seats) => {
    if (err) return res.status(500).send(err);
    const heldSeats = Object.keys(seats).filter(
      (seat) => seats[seat].includes(`hold:${userId}:`) && seat != seatId
    );
    // Limit max number of seats user can hold, the time could also be moved to .env
    if (heldSeats.length >= limit)
      return res
        .status(500)
        .send({ error: `Can't hold more than ${limit} seat` });
    redisClient.hset(
      `event:${eventId}`,
      seatId,
      `hold:${userId}:${timestamp}`,
      (err, result) => {
        if (err) return res.status(500).send(err);

        setTimeout(() => {
          redisClient.hget(`event:${eventId}`, seatId, (err, seatStatus) => {
            if (
              !err &&
              seatStatus !== `reserved:${userId}` &&
              seatStatus === `hold:${userId}:${timestamp}`
            )
              redisClient.hset(`event:${eventId}`, seatId, `available`);
          });
        }, HOLD_DEFAULT);
        return res.status(200).send({ message: "Seat held" });
      }
    );
  });
};

module.exports = {
  holdSeat,
  reserveSeat,
  refreshSeat,
};
