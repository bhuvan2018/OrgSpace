const Membership = require("../modules/membership/membership.model");

module.exports = async function (req, res, next) {
  const orgId = req.headers["x-org-id"];

  if (!orgId) {
    return res.status(400).json({ message: "Organization ID required" });
  }

  const membership = await Membership.findOne({
    userId: req.userId,
    orgId,
  });

  if (!membership) {
    return res.status(403).json({ message: "Access denied for this organization" });
  }

  req.orgId = orgId;
  req.role = membership.role;

  next();
};