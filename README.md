# express-access
<h1 align="center">Express Access</h1>

<p align="center">
  <img src="assets/logo.png" alt="Express Access Logo" width="250" height="250"/>
</p>

A role-based access control middleware for Express.js applications.

## Installation

```bash
npm install express-access
```

## Features

- Simple role-based access control
- TypeScript support
- Custom authentication middleware integration
- Flexible permission checking
- Supports all HTTP methods

## Usage

```javascript
const express = require('express');
const expressAccess = require('express-access');

const app = express();
expressAccess(app);

// Configure access control
app.access.config({
  authMiddleware: (req, res, next) => {
    // Your authentication logic
    req.user = { id: 1, permissions: ['user:list', 'user:create'] };
    next();
  },
  checkPermission: async (user, permission) => {
    // Your permission checking logic
    return user.permissions.includes(permission);
  }
});

// Public route - no authentication required
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API' });
});

// Protected route - requires 'user:list' permission
app.access.get('/users', 'user:list', (req, res) => {
  res.json({ message: 'User list fetched successfully.' });
});

app.listen(3000);
```

## API

### expressAccess(app)

Patches the Express application with access control methods.

### app.access.config(options)

Configure the access control middleware.

- `options.authMiddleware`: Authentication middleware function
- `options.checkPermission`: Permission checking function

### Protected Routes

- `app.access.get(path, permission, handlers)`
- `app.access.post(path, permission, handlers)`
- `app.access.put(path, permission, handlers)`
- `app.access.delete(path, permission, handlers)`
- `app.access.patch(path, permission, handlers)`
- `app.access.options(path, permission, handlers)`
- `app.access.head(path, permission, handlers)`
- `app.access.all(path, permission, handlers)`
- `app.access.use(path, permission, handlers)`

## TypeScript Support

```typescript
import expressAccess from 'express-access';

interface User {
  id: number;
  permissions: string[];
}

app.access.config<User>({
  authMiddleware: (req, res, next) => {
    req.user = { id: 1, permissions: ['user:list', 'user:create'] };
    next();
  },
  checkPermission: async (user, permission) => {
    return user.permissions.includes(permission);
  }
});
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

