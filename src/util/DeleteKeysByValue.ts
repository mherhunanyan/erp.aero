import { redis } from 'database/Redis';

export const deleteKeysByValue = async (valueToDelete: any) => {
    const keys = await redis.keys('*');
    keys.forEach(async (currKey) => {
        const currValue = await redis.get(currKey);
        if (currValue === valueToDelete) {
            await redis.del(currKey);
        }
    });
};
