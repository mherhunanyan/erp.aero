import { redis } from 'database/Redis';

export const checkIfTokenIsRevoked = async (token: string) => {
    return await redis.get(token);
};
