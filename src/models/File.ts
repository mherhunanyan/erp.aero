import { DataTypes, Model } from 'sequelize';
import { sequelize } from 'database/Sequelize';

export class File extends Model {
    declare name: string;
    declare extension: string;
    declare mimeType: string;
    declare size: number;
    declare uploadDate: number;
}

File.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        extension: {
            type: DataTypes.STRING,
            // allowNull: false,
        },
        mimeType: {
            type: DataTypes.STRING,
            // allowNull: false,
        },
        size: {
            type: DataTypes.INTEGER,
            // allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'File',
        createdAt: false,
        updatedAt: true,
    },
);
