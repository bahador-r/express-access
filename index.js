const access = require('./access');

/**
 * Express.js middleware that adds role-based access control functionality
 * Patches the Express app instance with additional access control methods
 * 
 * @param {import('express').Application} app - Express application instance
 * @returns {void}
 */
function patchExpress(app) {
  app.access = {
    // Initialize access control configuration
    config: (options) => access.init(app, options),
    // Register route handlers with permission checks
    get: (path, permission, handlers = []) => access.registerRoute(app, 'get', path, permission, handlers),
    post: (path, permission, handlers = []) => access.registerRoute(app, 'post', path, permission, handlers),
    put: (path, permission, handlers = []) => access.registerRoute(app, 'put', path, permission, handlers),
    delete: (path, permission, handlers = []) => access.registerRoute(app, 'delete', path, permission, handlers),
    patch: (path, permission, handlers = []) => access.registerRoute(app, 'patch', path, permission, handlers),
    options: (path, permission, handlers = []) => access.registerRoute(app, 'options', path, permission, handlers),
    head: (path, permission, handlers = []) => access.registerRoute(app, 'head', path, permission, handlers),
    all: (path, permission, handlers = []) => access.registerRoute(app, 'all', path, permission, handlers),
    use: (path, permission, handlers = []) => access.registerRoute(app, 'use', path, permission, handlers),
  };
}

module.exports = patchExpress;
