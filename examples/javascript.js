/**
 * Example implementation of express-access middleware
 * Demonstrates basic setup and usage with Express.js
 */
import express from 'express';
import access from 'express-access';

const app = express();
access(app);

/**
 * Configure access control middleware
 * Sets up authentication and permission checking
 */
app.access.config({
  // Authentication middleware that sets mock user data
  authMiddleware: (req, res, next) => {
    req.user = { uid: 'user1', role: 'admin' };
    next();
  },
  // Permission checking function that verifies user access rights
  checkPermission: async (user, permission) => {
    const userPermissions = {
      user1: ['test:read'],
    };
    return userPermissions[user.uid]?.includes(permission) || false;
  },
});

// Public route - no authentication required
app.get('/', (req, res) => res.send('Public route'));

/**
 * Protected route - requires 'test:read' permission
 * Uses array of middleware handlers for request processing
 */
app.access.get('/test', 'test:read', [
  (req, res) => res.json({ success: true, message: 'Authorized' }),
]);

// Start the server on port 3000
app.listen(3000, () => console.log('Server started'));
