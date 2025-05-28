/**
 * Example TypeScript implementation of express-access middleware
 * Demonstrates type-safe setup and usage with Express.js
 */
import express from 'express';
import expressAccess from 'express-access';

/**
 * Custom user interface for type-safe access control
 * @interface User
 */
interface User {
  /** Unique identifier for the user */
  id: number;
  /** Array of role names assigned to the user */
  roles: string[];
  /** Array of permission strings the user has */
  permissions: string[];
}

const app = express();

/**
 * Initialize and configure access control with type safety
 */
expressAccess(app);

/**
 * Configure access control middleware with User type
 * Sets up typed authentication and permission checking
 */
app.access.config<User>({
  authMiddleware: (req, res, next) => {
    // Mock authentication that sets typed user object
    req.user = {
      id: 1,
      roles: ['admin'],
      permissions: ['users.read', 'users.write']
    };
    next();
  },
  checkPermission: async (user, permission) => {
    // Type-safe permission check using User interface
    return user.permissions.includes(permission);
  }
});

/**
 * Protected GET route requiring 'users.read' permission
 * Demonstrates type-safe access to user properties
 */
app.access.get('/users', 'users.read', (req, res) => {
  const user = req.user as User;
  res.json({
    message: `Hello ${user.roles.join(', ')}`,
    userId: user.id
  });
});

/**
 * Protected POST route requiring 'users.write' permission
 * Demonstrates simple route protection
 */
app.access.post('/users', 'users.write', (req, res) => {
  res.json({ message: 'User created' });
});

// Start the server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});