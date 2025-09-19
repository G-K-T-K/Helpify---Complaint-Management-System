const adminMiddleware = (req, res, next) => {
  // We assume the auth.middleware has already run and attached the user to the request
  if (req.user && req.user.role === 'admin') {
    next(); // User is an admin, proceed to the next function
  } else {
    res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  }
};

module.exports = adminMiddleware;