const jwt=require('jsonwebtoken')

exports.protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await db.user.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({ message: 'User not found' });
            }

            
        } catch (error) {
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
    next();
};

exports.admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as admin' });
    }
};


exports.roleMiddleware = (requiredRoles) => {
    return function (req, res, next) {
        const userRoles = req.user.roles; // Assume `req.user` is set after authentication
    
        if (!userRoles) {
          return res.status(403).json({ message: 'No roles assigned' });
        }
        let isAdmin=userRoles.includes('admin')
        req.user.isAdmin=isAdmin?true:false
        // Check if the user has at least one of the required roles
        const hasAccess = requiredRoles.some(role => userRoles.includes(role));
    
        if (!hasAccess) {
          return res.status(403).json({ message: 'Access forbidden: insufficient role' });
        }
    
        next();
      };
  };
  

  
