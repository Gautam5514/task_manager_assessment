import jwt from 'jsonwebtoken';
import User from '../models/User';
import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorMiddleware';

interface AuthRequest extends Request {
    user?: any;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token!, process.env.JWT_SECRET as string) as any;

            req.user = await User.findById(decoded.id).select('-password');

            next();
        } catch (error) {
            next(new AppError('Not authorized, token failed', 401));
        }
    }

    if (!token) {
        next(new AppError('Not authorized, no token', 401));
    }
};
