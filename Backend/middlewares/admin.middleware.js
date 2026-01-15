/**
 * Admin Authorization Middleware
 * Verifies that the authenticated user has admin privileges
 * @module middlewares/admin.middleware
 */

import User from '../models/User.model.js';

/**
 * Check if user is an admin
 * Must be used after authenticate middleware
 */
export const isAdmin = async (req, res, next) => {
  try {
    // Check if user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Fetch user from database to check role
    const user = await User.findById(req.user.id).select('role email isAdmin');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user has admin role
    // Supporting both 'role' field and 'isAdmin' boolean for flexibility
    const hasAdminRole = user.role === 'admin' || user.isAdmin === true;
    
    if (!hasAdminRole) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    // Attach full user object to request for use in controller
    req.admin = user;
    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying admin status'
    });
  }
};

/**
 * Check if user is a moderator or admin
 * Moderators can perform limited administrative actions
 */
export const isModerator = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const user = await User.findById(req.user.id).select('role email isAdmin isModerator');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user is admin or moderator
    const hasModeratorAccess = 
      user.role === 'admin' || 
      user.role === 'moderator' ||
      user.isAdmin === true ||
      user.isModerator === true;
    
    if (!hasModeratorAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Moderator privileges required.'
      });
    }

    req.moderator = user;
    next();
  } catch (error) {
    console.error('Moderator middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying moderator status'
    });
  }
};

/**
 * Check if user can perform admin actions
 * Combines authentication and admin role check
 */
export const requireAdmin = [isAdmin];

/**
 * Check if user can perform moderator actions
 * Combines authentication and moderator role check
 */
export const requireModerator = [isModerator];

/**
 * Log admin actions for audit trail
 */
export const logAdminAction = (action) => {
  return (req, res, next) => {
    const adminInfo = {
      adminId: req.user?.id || req.admin?.id,
      adminEmail: req.admin?.email || req.user?.email,
      action,
      timestamp: new Date().toISOString(),
      ip: req.ip || req.connection.remoteAddress,
      path: req.path,
      method: req.method
    };

    console.log('🔐 Admin Action:', JSON.stringify(adminInfo, null, 2));
    
    // Store in database for audit trail (optional)
    // await AdminLog.create(adminInfo);
    
    next();
  };
};

export default {
  isAdmin,
  isModerator,
  requireAdmin,
  requireModerator,
  logAdminAction
};
