import { NextFunction, Request, Response } from 'express';
import LoggerFactory from 'logger/Logger.factory';
import { File } from 'models/File';

export const fileUploadHandler = async (req: Request, res: Response, next: NextFunction) => {
    const logger = LoggerFactory.getLogger('fileUploadHandler');
    try {
        if (!req.file) {
            return res.status(400).send('No files were uploaded.');
        }
        const { filename, originalname, mimetype, size } = req.file;
        const extension = originalname.split('.').pop();

        await File.create({ name: filename, extension, mimetype, size });

        return res.status(200).json({ message: 'File uploaded successfully!' });
    } catch (error) {
        logger.error(error as string);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const getFileHandler = async (req: Request, res: Response, next: NextFunction) => {
    const logger = LoggerFactory.getLogger('getFileHandler');
    try {
        const fileId = req.params.id;
        if (!fileId) {
            return res.status(400).json({ message: 'No file ID is provided.' });
        }
        const file = await File.findOne({ where: { name: fileId } });
        if (!file) {
            return res.status(404).json({ message: 'File ID not found.' });
        }
        res.json(file);
        return next();
    } catch (error) {
        logger.error(error as string);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteFileHandler = async (req: Request, res: Response, next: NextFunction) => {
    const logger = LoggerFactory.getLogger('deleteFileHandler');
    try {
        const fileId = req.params.id;
        if (!fileId) {
            res.send(400).json({ message: 'No file ID is provided' });
        }
        const file = await File.destroy({ where: { name: fileId } });
        if (file) {
            res.status(200).json({
                message: 'file is successfully deleted',
            });
            return next();
        } else {
            return res.status(404).json({ message: 'File ID not found.' });
        }
    } catch (error) {
        logger.error(error as string);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
