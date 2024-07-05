import { database } from 'Config';
import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize(database.name, database.username, database.password, {
    host: database.host,
    dialect: 'mysql',
    logging: false
});
