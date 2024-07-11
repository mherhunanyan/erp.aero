import { upload } from 'utils/FileUploader';
import { Router } from 'express';
import {
    deleteFileHandler,
    downloadFileHandler,
    uploadFileHandler,
    getFileHandler,
    updatefileHandler,
} from 'controllers/FileController';

export const fileRouter = Router();

fileRouter.post('/upload', upload.single('file'), uploadFileHandler);
fileRouter.get('/:id', getFileHandler);
fileRouter.delete('/delete/:id', deleteFileHandler);
fileRouter.get('/download/:id', downloadFileHandler);
fileRouter.put('/update/:id', upload.single('file'), updatefileHandler);
