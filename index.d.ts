import { Application, Request, RequestHandler } from 'express';

/**
 * Configuration options for initializing the access control middleware
 * @template User - Type for the authenticated user object
 */
export type AccessOptions<User = any> = {
    /** Express middleware function that handles authentication */
    authMiddleware: RequestHandler;
    /** Function that verifies if a user has the required permission */
    checkPermission: (user: User, permission: string) => Promise<boolean>;
};

/**
 * Access control interface that extends Express application
 * Provides methods for registering protected routes with permission checks
 * @template User - Type for the authenticated user object
 */
export type Access<User = any> = {
    /** Initialize access control with authentication and permission options */
    config: (options: AccessOptions<User>) => void;
    /** Register protected GET route */
    get: (path: string, permission: string, handlers?: RequestHandler[]) => void;
    /** Register protected POST route */
    post: (path: string, permission: string, handlers?: RequestHandler[]) => void;
    /** Register protected PUT route */
    put: (path: string, permission: string, handlers?: RequestHandler[]) => void;
    /** Register protected DELETE route */
    delete: (path: string, permission: string, handlers?: RequestHandler[]) => void;
    /** Register protected PATCH route */
    patch: (path: string, permission: string, handlers?: RequestHandler[]) => void;
    /** Register protected OPTIONS route */
    options: (path: string, permission: string, handlers?: RequestHandler[]) => void;
    /** Register protected HEAD route */
    head: (path: string, permission: string, handlers?: RequestHandler[]) => void;
    /** Register protected route for all HTTP methods */
    all: (path: string, permission: string, handlers?: RequestHandler[]) => void;
    /** Register protected middleware */
    use: (path: string, permission: string, handlers?: RequestHandler[]) => void;
};

/**
 * Express module augmentation to add access control functionality
 */
declare module 'express' {
    interface Application {
        /** Access control methods for route protection */
        access: Access;
    }

    interface Request {
        /** User object attached by authentication middleware */
        user?: any;
    }
}

/**
 * Patches an Express application instance with access control functionality
 * @param app - Express application to be patched
 */
declare function patchExpress(app: Application): void;

export default patchExpress;
