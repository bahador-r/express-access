const express = require('express');
const request = require('supertest');
const expressAccess = require('../index');

/**
 * Test suite for express-access middleware
 * Tests configuration, route protection, HTTP methods, and error handling
 */
describe('express-access', () => {
  /** @type {import('express').Application} */
  let app;

  beforeEach(() => {
    app = express();
    expressAccess(app);
  });

  /**
   * Tests for middleware configuration and initialization
   */
  describe('Configuration', () => {
    it('should add access control methods to express app', () => {
      expect(app.access).toBeDefined();
      expect(typeof app.access.config).toBe('function');
      expect(typeof app.access.get).toBe('function');
      expect(typeof app.access.post).toBe('function');
    });

    it('should require config before using protected routes', async () => {
      expect(() => {
        app.access.get('/test', 'test.read', (req, res) => res.send('ok'));
      }).toThrow('express-access: config must be called before defining protected routes');
    });
  });

  /**
   * Tests for protected route functionality
   * Verifies permission checking and access control
   */
  describe('Protected Routes', () => {
    beforeEach(() => {
      app.access.config({
        authMiddleware: (req, res, next) => {
          req.user = { id: 1, permissions: ['test.access'] };
          next();
        },
        checkPermission: async (user, permission) => {
          return user.permissions.includes(permission);
        }
      });
    });

    it('should allow access with valid permissions', async () => {
      app.access.get('/protected', 'test.access', (req, res) => {
        res.json({ success: true });
      });

      const response = await request(app).get('/protected');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ success: true });
    });

    it('should deny access without required permissions', async () => {
      app.access.config({
        authMiddleware: (req, res, next) => {
          req.user = { id: 1, permissions: ['user'] };
          next();
        },
        checkPermission: async () => false
      });

      app.access.get('/admin', 'admin.access', (req, res) => {
        res.json({ success: true });
      });

      const response = await request(app).get('/admin');
      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });
  });

  /**
   * Tests for different HTTP method handlers
   * Verifies that all supported HTTP methods work correctly
   */
  describe('HTTP Methods', () => {
    beforeEach(() => {
      app.access.config({
        authMiddleware: (req, res, next) => {
          req.user = { id: 1, permissions: ['admin'] };
          next();
        },
        checkPermission: async () => true
      });
    });

    const methods = ['get', 'post', 'put', 'delete', 'patch', 'options', 'head'];

    methods.forEach(method => {
      it(`should handle ${method.toUpperCase()} requests`, async () => {
        app.access[method]('/test', 'test.access', (req, res) => {
          res.json({ method: req.method });
        });

        const response = await request(app)[method]('/test');
        expect(response.status).toBe(200);
        if (method !== 'head') {
          expect(response.body.method).toBe(method.toUpperCase());
        }
      });
    });
  });

  /**
   * Tests for error handling scenarios
   * Verifies proper handling of permission check failures
   */
  describe('Error Handling', () => {
    beforeEach(() => {
      app.access.config({
        authMiddleware: (req, res, next) => {
          req.user = { id: 1 };
          next();
        },
        checkPermission: async () => {
          throw new Error('Permission check failed');
        }
      });
    });

    it('should handle permission check errors', async () => {
      app.access.get('/error', 'test.access', (req, res) => {
        res.json({ success: true });
      });

      const response = await request(app).get('/error');
      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Permission check error');
      expect(response.body.error).toBe('Permission check failed');
    });
  });
});