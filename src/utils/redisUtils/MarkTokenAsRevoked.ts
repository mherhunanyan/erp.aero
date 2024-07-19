import { redis } from 'database/Redis';

export const markTokenAsRevoked = async (accessToken: string, remainingTimeToken: number) => {
    await redis.set(accessToken, 'active', { EX: remainingTimeToken });
};
