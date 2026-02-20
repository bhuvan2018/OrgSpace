const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const authRoutes = require("./modules/auth/auth.routes");
const inviteRoutes = require("./modules/invite/invite.routes");

const auth = require("./middleware/auth.middleware");
const tenant = require("./middleware/tenant.middleware");
const limiter = require("./middleware/rateLimiter");

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use(limiter);

app.use("/api/auth", authRoutes);
app.use("/api/org", inviteRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

app.get("/api/test-secure", auth, tenant, (req, res) => {
  res.json({
    message: "Tenant access granted",
    userId: req.userId,
    orgId: req.orgId,
    role: req.role,
  });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

module.exports = app;