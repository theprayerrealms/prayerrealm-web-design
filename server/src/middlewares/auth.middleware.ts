import { Request, Response, NextFunction } from 'express';
import { db, auth } from '../config/firebase';

export const protect = async (req: any, res: Response, next: NextFunction) => {
    let token;
    if (req.headers.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
        const decodedToken = await auth.verifyIdToken(token);
        const userSnapshot = await db.collection('users').doc(decodedToken.uid).get();
        
        if (!userSnapshot.exists) {
            return res.status(404).json({ message: 'User not found in Firestore' });
        }

        req.user = { id: userSnapshot.id, ...userSnapshot.data() };
        next();
    } catch (error) {
        console.error('Auth Error:', error);
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

export const authorize = (...roles: string[]) => {
    return (req: any, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: `Role ${req.user.role} not authorized` });
        }
        next();
    };
};
