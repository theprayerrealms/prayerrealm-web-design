import jwt from 'jsonwebtoken';
import { config } from '../config/db';

export const generateTokens = (id: string) => {
    const accessToken = jwt.sign({ id }, config.JWT.ACCESS_SECRET, {
        expiresIn: config.JWT.ACCESS_EXPIRATION as any,
    });

    const refreshToken = jwt.sign({ id }, config.JWT.REFRESH_SECRET, {
        expiresIn: config.JWT.REFRESH_EXPIRATION as any,
    });

    return { accessToken, refreshToken };
};
