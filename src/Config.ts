import dotenv from 'dotenv';

dotenv.config();

export const { PORT, database, NODE_ENV, jwtConfig } = {
    database: {
        host: process.env.DB_HOST,
        password: process.env.DB_PASSWORD,
        username: process.env.DB_USERNAME || 'root',
        name: process.env.DB_NAME || 'AuthFileServiceDB',
        port: parseInt(process.env.DB_PORT || '3306', 10),
    },
    jwtConfig: {
        ACCESS_TOKEN_EXPIRY: process.env.JWT_ACCESS_TOKEN_EXPIRY || '10m',
        REFRESH_TOKEN_EXPIRY: process.env.JWT_REFRESH_TOKEN_EXPIRY || '7d',
        ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET || 'accesstokensecrethere',
        REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET || 'refreshtokensecrethere',
    },
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT || 3000,
};
