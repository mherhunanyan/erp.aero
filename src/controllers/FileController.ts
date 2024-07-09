import { Request, Response } from 'express';
import { File } from 'models/File';

export const fileUploadHandler = async (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).send('No files were uploaded.');
    }
    const { filename, originalname, mimetype, size } = req.file;
    const extension = originalname.split('.').pop();

    await File.create({ name: filename, extension, mimetype, size });

    res.send('File uploaded successfully!');
};

export const getFileHandler = async (req: Request, res: Response) => {
    const fileId = req.params.id;
    if (!fileId) {
        res.status(401).json({ message: 'No id is provided.' });
    }
    const file = await File.findOne({ where: { name: fileId } });
    if (!file) {
        res.status(401).json({ message: 'wrong file id' });
    }
    return res.send(file);
};
