import { NextFunction, Request, Response } from 'express';
import LoggerFactory from 'logger/Logger.factory';
import randomString from 'randomstring';
import { unlinkSync } from 'node:fs';
import { File } from 'models/File';
import path from 'path';

export const uploadFileHandler = async (req: Request, res: Response, next: NextFunction) => {
    const logger = LoggerFactory.getLogger('uploadFileHandler');
    try {
        if (!req.file) {
            return res.status(400).send('No files were uploaded.');
        }
        const { filename, originalname, mimetype, size } = req.file;
        const extension = path.extname(originalname);

        const fileId = randomString.generate(10);

        await File.create({ id: fileId, name: filename, extension, mimetype, size });
        return res.status(200).json({ message: 'File uploaded successfully!', fileId });
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
        const file = await File.findByPk(fileId);
        if (!file) {
            return res.status(404).json({ message: 'File ID not found.' });
        }
        return res.json(file);
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
        const file = await File.findByPk(fileId);
        if (file) {
            unlinkSync(`uploads/${file.name}`);
        }
        const isDestroyed = await File.destroy({ where: { id: fileId } });
        if (isDestroyed) {
            return res.status(200).json({
                message: 'file is successfully deleted',
            });
        } else {
            return res.status(404).json({ message: 'File ID not found.' });
        }
    } catch (error) {
        logger.error(error as string);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const downloadFileHandler = async (req: Request, res: Response, next: NextFunction) => {
    const logger = LoggerFactory.getLogger('downloadFileHandler');
    try {
        const fileId = req.params.id;
        const file = await File.findByPk(fileId);
        if (!file) {
            logger.warn(`File with ID ${fileId} not found`);
            return res.status(404).json({ message: 'File not found' });
        }
        const fileName = file.name;
        const fileDirPath = path.join(__dirname, '../../uploads');
        const filePath = path.join(fileDirPath, `/${fileName}`);
        return res.sendFile(filePath);
    } catch (error) {
        logger.error(error as string);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const updatefileHandler = async (req: Request, res: Response, next: NextFunction) => {
    const logger = LoggerFactory.getLogger('updatefileHandler');
    try {
        if (!req.file) {
            return res.status(400).send('No files were uploaded.');
        }
        const { filename, originalname, mimetype, size } = req.file;
        const extension = path.extname(originalname);
        const fileId = req.params.id;
        if (!fileId) {
            return res.status(400).json({ message: 'No file ID is provided.' });
        }
        const file = await File.findByPk(fileId);

        if (!file) {
            logger.warn(`File with ID ${fileId} not found`);
            return res.status(404).json({ message: 'File not found' });
        }
        unlinkSync(`uploads/${file.name}`);
        file.set({ name: filename, extension, mimetype, size });
        await file.save();

        res.status(200).json({ message: 'File updated successfully', file });
        return next();
    } catch (error) {
        logger.error(error as string);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const getListOfFilesHandler = async (req: Request, res: Response, next: NextFunction) => {
    const logger = LoggerFactory.getLogger('getListOfFilesHandler');
    try {
        const listSize = Number(req.query.list_size);
        const page = Number(req.query.page);
        const filesCount = await File.count();

        if (filesCount < 1) {
            return res.status(404).json({
                message: 'No files available.',
            });
        }

        if (!listSize || listSize < 1) {
            const limit = filesCount < 10 ? filesCount : 10;
            if (page > 0) {
                const offset = (page - 1) * limit;
                const files = await File.findAll({ limit, offset });
                return res.json(files);
            } else {
                const files = await File.findAll({ limit });
                return res.json(files);
            }
        }
        const limit = filesCount < listSize ? filesCount : listSize;
        if (page > 0) {
            const offset = (page - 1) * limit;
            const files = await File.findAll({ limit, offset });
            return res.json(files);
        } else {
            const files = await File.findAll({ limit });
            return res.json(files);
        }
    } catch (error) {
        logger.error(error as string);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
