import { Request, Response, NextFunction } from 'express';

// Logs some basic info for the specified request to the console.
export default function logRequest(request: Request, _: Response, next: NextFunction): void {
    console.log(`${Date.now()} : Processing ${request.method} for ${request.path}`);
    next();
}
