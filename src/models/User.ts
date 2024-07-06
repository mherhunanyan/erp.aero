import { sequelize } from 'database/Sequelize';
import { DataTypes, Model } from 'sequelize';

export class User extends Model {
    declare id: string;
    declare password: string;
}

User.init(
    {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'User',
        timestamps: false,
    },
);
