const Redis = require("ioredis");

let redis;

if (process.env.REDIS_URL) {
  redis = new Redis(process.env.REDIS_URL);
  redis.on("connect", () => console.log("Redis Connected"));
  redis.on("error", (err) => console.log("Redis Error", err));
} else {
  console.log("Redis not configured, running without cache");
}

module.exports = redis;