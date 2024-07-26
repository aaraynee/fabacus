const redis = require("redis");

// Host and Port could be moved over to .env
const client = redis.createClient({
  url: "redis://redis:6379",
});

client.on("error", (err) => {
  console.error("Error connecting to Redis", err);
});

client.on("connect", () => {
  console.log("Connected to Redis");
});

module.exports = client;
