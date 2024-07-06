import { DataTypes, Model } from 'sequelize';
import { sequelize } from 'database/Sequelize';

export class User extends Model {
    declare id: number;
    declare password: string;
}

User.init(
    {
        id: {
            type: DataTypes.NUMBER,
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
