const User = require("../user/user.model");
const Membership = require("../membership/membership.model");

const inviteUser = async (req, res) => {
  try {
    const { email, role } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const existing = await Membership.findOne({
      userId: user._id,
      orgId: req.orgId,
    });

    if (existing) {
      return res.status(400).json({ message: "User already in organization" });
    }

    const membership = await Membership.create({
      userId: user._id,
      orgId: req.orgId,
      role: role || "member",
    });

    res.json({ message: "User invited successfully", membership });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getMembers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const members = await Membership.find({ orgId: req.orgId })
      .populate("userId", "name email")
      .skip(skip)
      .limit(limit);

    const total = await Membership.countDocuments({ orgId: req.orgId });

    res.json({
      page,
      totalPages: Math.ceil(total / limit),
      totalMembers: total,
      members,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { inviteUser, getMembers };