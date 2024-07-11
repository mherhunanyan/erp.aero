import { upload } from 'utils/FileUploader';
import { Router } from 'express';
import {
    deleteFileHandler,
    downloadFileHandler,
    uploadFileHandler,
    getFileHandler,
    updatefileHandler,
    getListOfFilesHandler,
} from 'controllers/FileController';

export const fileRouter = Router();

fileRouter.post('/upload', upload.single('file'), uploadFileHandler);
fileRouter.put('/update/:id', upload.single('file'), updatefileHandler);
fileRouter.delete('/delete/:id', deleteFileHandler);
fileRouter.get('/list', getListOfFilesHandler);
fileRouter.get('/download/:id', downloadFileHandler);
fileRouter.get('/:id', getFileHandler);
