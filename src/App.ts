import LoggerFactory from 'logger/Logger.factory';
import { authRouter } from 'routes/Auth';
import { sequelize } from 'database/Sequelize';
import bodyParser from 'body-parser';
import { PORT } from 'Config';
import express from 'express';
import cors from 'cors';

const app = express();

const logger = LoggerFactory.getLogger('App');
app.use(cors());
app.use(bodyParser.json());

app.use(authRouter);

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
    } catch (error) {
        logger.error('Unable to connect to the database:', error as string);
    }

    app.listen(PORT, () => {
        logger.info('Server is running!');
    });
};

init();
