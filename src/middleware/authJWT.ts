import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import IJwtPayload from '../models/JWTPayload';

const _SECRET: string = 'api+jwt';

interface AuthenticatedRequest extends Request {
    idUser?: string; // Puedes ajustar el tipo según el tipo real de idUser
}

export async function verifyToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const token = req.header('x-access-token');
    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }
    try {
        const decoded = jwt.verify(token, _SECRET) as IJwtPayload;
        console.log('verifyToken');
        req.idUser = decoded.id;

        const user = await User.findById(req.idUser, { password: 0 });

        if (!user) {
            return res.status(404).json({ message: 'No user found' });
        }

        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: 'Unauthorized!' });
    }
}

export async function isOwner(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        const user = await User.findById(req.idUser);

        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
