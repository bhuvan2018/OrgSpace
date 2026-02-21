const redis = require("../../config/redis");
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

    if (redis) {
        const keys = await redis.keys(`members:${req.orgId}:*`);
        if (keys.length) await redis.del(keys);
    }

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

    const cacheKey = `members:${req.orgId}:page:${page}:limit:${limit}`;

    if (redis) {
      const cached = await redis.get(cacheKey);
      if (cached) {
        return res.json(JSON.parse(cached));
      }
    }

    const members = await Membership.find({ orgId: req.orgId })
      .populate("userId", "name email")
      .skip(skip)
      .limit(limit);

    const total = await Membership.countDocuments({ orgId: req.orgId });

    const response = {
      page,
      totalPages: Math.ceil(total / limit),
      totalMembers: total,
      members,
    };

    if (redis) {
      await redis.set(cacheKey, JSON.stringify(response), "EX", 60);
    }

    res.json(response);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const cacheKey = `dashboard:${req.orgId}`;

    if (redis) {
      const cached = await redis.get(cacheKey);
      if (cached) return res.json(JSON.parse(cached));
    }

    const totalMembers = await Membership.countDocuments({ orgId: req.orgId });
    const admins = await Membership.countDocuments({
      orgId: req.orgId,
      role: "admin",
    });

    const response = {
      orgId: req.orgId,
      totalMembers,
      admins,
    };

    if (redis) {
      await redis.set(cacheKey, JSON.stringify(response), "EX", 60);
    }

    res.json(response);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { inviteUser, getMembers, getDashboardStats };