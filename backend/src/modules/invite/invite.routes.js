const express = require("express");
const router = express.Router();
const controller = require("./invite.controller");

const auth = require("../../middleware/auth.middleware");
const tenant = require("../../middleware/tenant.middleware");
const role = require("../../middleware/role.middleware");

router.post(
  "/invite",
  auth,
  tenant,
  role("admin"),
  controller.inviteUser
);

router.get(
  "/members",
  auth,
  tenant,
  controller.getMembers
);

module.exports = router;