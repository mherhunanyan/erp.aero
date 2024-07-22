import { isAuthMiddleware } from 'middlewares/IsAuthMiddleware';
import LoggerFactory from 'logger/Logger.factory';
import { sequelize } from 'database/Sequelize';
import { authRouter } from 'routes/AuthRouter';
import { fileRouter } from 'routes/FileRouter';
import bodyParser from 'body-parser';
import { PORT } from 'Config';
import express from 'express';
import cors from 'cors';

const logger = LoggerFactory.getLogger('App');
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use(authRouter);
app.use('/file', isAuthMiddleware, fileRouter);

const init = async () => {
    try {
        await sequelize.authenticate();
        logger.info('Connection has been established successfully.');
        try {
            await sequelize.sync({ alter: true });
            logger.info('All models were synchronized successfully.');
        } catch (error) {
            logger.error('process synchronization db was failed', error as string);
        }
        app.listen(PORT, () => {
            logger.info(`Server is running on port ${PORT}!`);
        });
    } catch (error) {
        logger.error('Unable to connect to the database:', error as string);
    }
};

init();
