// server/middleware/checkRole.js
const checkRole = (requiredRoles) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.auth.id);
      
      if (!user || !requiredRoles.includes(user.role)) {
        return res.status(403).json({ 
          message: `Access denied. Required roles: ${requiredRoles.join(', ')}`
        });
      }
      
      next();
    } catch (error) {
      console.error('Role check error:', error);
      res.status(500).json({ message: 'Server Error' });
    }
  };
};

module.exports = checkRole;