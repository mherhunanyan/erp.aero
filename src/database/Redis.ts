import LoggerFactory from 'logger/Logger.factory';
import { createClient } from 'redis';

export const redis = createClient();

const logger = LoggerFactory.getLogger('redis');

redis.on('error', (err) => logger.error('Redis Client Error', err));

const clientConnect = async () => {
    await redis.connect();
};

clientConnect();
