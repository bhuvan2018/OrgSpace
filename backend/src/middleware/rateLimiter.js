const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  message: "Too many requests, slow down",
});

module.exports = limiter;