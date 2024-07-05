import LoggerFactory from 'logger/Logger.factory';
import { createClient } from 'redis';

export const client = createClient();

const logger = LoggerFactory.getLogger('redis');

client.on('error', (err) => logger.error('Redis Client Error', err));

const clientConnect = async () => {
    await client.connect();
};

clientConnect();
