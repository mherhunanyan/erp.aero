import dotenv from 'dotenv';

dotenv.config();

export const { PORT, database, NODE_ENV, EXAcessToken, EXRefreshToken } = {
    database: {
        host: process.env.DB_HOST,
        username: process.env.DB_USERNAME || 'root',
        password: process.env.DB_PASSWORD,
        name: process.env.DB_NAME || 'AuthFileServiceDB',
        port: parseInt(process.env.DB_PORT || '3306', 10),
    },
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT || 3000,
    EXAcessToken: Number(process.env.EXTAcessToken || 600), // 10min
    EXRefreshToken: Number(process.env.EXTRefreshToken || 604800), // 7days
};
