import { Sequelize } from 'sequelize';
import { database } from 'Config';

export const sequelize = new Sequelize(database.name, database.username, database.password, {
    host: database.host,
    dialect: 'mysql',
    logging: false,
});
