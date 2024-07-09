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
