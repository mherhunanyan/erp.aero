import { deleteFileHandler, fileUploadHandler, getFileHandler } from 'controllers/FileController';
import { upload } from 'utils/FileUploader';
import { Router } from 'express';

export const fileRouter = Router();

fileRouter.post('/upload', upload.single('file'), fileUploadHandler);
fileRouter.get('/:id', getFileHandler);
fileRouter.delete('/delete/:id', deleteFileHandler);
