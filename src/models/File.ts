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
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        extension: {
            type: DataTypes.STRING,
        },
        mimeType: {
            type: DataTypes.STRING,
        },
        size: {
            type: DataTypes.INTEGER,
        },
    },
    {
        sequelize,
        modelName: 'File',
        createdAt: true,
        updatedAt: false,
    },
);
