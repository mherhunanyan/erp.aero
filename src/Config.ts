import dotenv from 'dotenv';

dotenv.config();

export const {
    PORT,
    database,
    NODE_ENV,
    EXACCESS_TOKEN,
    EXREFRESH_TOKEN,
    ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET,
} = {
    database: {
        host: process.env.DB_HOST,
        password: process.env.DB_PASSWORD,
        username: process.env.DB_USERNAME || 'root',
        name: process.env.DB_NAME || 'AuthFileServiceDB',
        port: parseInt(process.env.DB_PORT || '3306', 10),
    },
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT || 3000,
    EXACCESS_TOKEN: process.env.EXACCESS_TOKEN || '10m',
    EXREFRESH_TOKEN: process.env.EXREFRESH_TOKEN || '7d',
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || 'accesstokensecrethere',
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || 'refreshtokensecrethere',
};
