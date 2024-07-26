const express = require("express");
const bodyParser = require("body-parser");

const Events = require("./routes/events");
const Reservations = require("./routes/reservations");

const app = express();

// Port hard coded but in future can be moved to .env
const PORT = 5000;

app.use(bodyParser.json());
app.use("/api/events", Events);
app.use("/api/reservations", Reservations);

app.listen(PORT, function () {
  console.log(`API is listening on port ${PORT}`);
});
