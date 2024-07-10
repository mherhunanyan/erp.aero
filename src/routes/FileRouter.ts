import {
    deleteFileHandler,
    downloadFileHandler,
    fileUploadHandler,
    getFileHandler,
} from 'controllers/FileController';
import { Router } from 'express';
import { upload } from 'utils/FileUploader';

export const fileRouter = Router();

fileRouter.post('/upload', upload.single('file'), fileUploadHandler);
fileRouter.get('/:id', getFileHandler);
fileRouter.delete('/delete/:id', deleteFileHandler);
fileRouter.get('/download/:id', downloadFileHandler);
fileRouter.put('/update/:id');
