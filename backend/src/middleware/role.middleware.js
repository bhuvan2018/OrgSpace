module.exports = function (requiredRole) {
  return (req, res, next) => {
    if (req.role !== requiredRole) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }
    next();
  };
};2