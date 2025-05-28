/**
 * Authentication middleware function reference
 * @type {Function|null}
 */
let authMiddleware = null;

/**
 * Permission checking function reference
 * @type {Function|null}
 */
let checkPermission = null;

/**
 * Initializes the access control configuration
 * @param {import('express').Application} app - Express application instance
 * @param {Object} options - Configuration options
 * @param {Function} options.authMiddleware - Authentication middleware function
 * @param {Function} options.checkPermission - Permission checking function
 * @returns {void}
 */
function init(app, options) {
  authMiddleware = options.authMiddleware;
  checkPermission = options.checkPermission;
}

/**
 * Registers a route with authentication and permission checks
 * @param {import('express').Application} app - Express application instance
 * @param {string} method - HTTP method
 * @param {string} path - Route path
 * @param {string} permission - Required permission
 * @param {Array<Function>} handlers - Route handlers
 */
function registerRoute(app, method, path, permission, handlers = []) {
  if (!authMiddleware || !checkPermission) {
    throw new Error('express-access: config must be called before defining protected routes');
  }

  // Ensure handlers is always an array
  const routeHandlers = Array.isArray(handlers) ? handlers : [handlers];

  app[method](path, authMiddleware, async (req, res, next) => {
    try {
      const hasAccess = await checkPermission(req.user, permission);
      if (!hasAccess) {
        return res.status(403).json({ success: false, message: 'Forbidden' });
      }
      next();
    } catch (err) {
      res.status(500).json({ success: false, message: 'Permission check error', error: err.message });
    }
  }, ...routeHandlers);
}

module.exports = { init, registerRoute };
