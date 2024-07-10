import { deleteFileHandler, fileUploadHandler, getFileHandler } from 'controllers/FileController';
import { isAuthMiddleware } from 'middlewares/IsAuthMiddleware';
import { Router } from 'express';
import { upload } from 'utils/FileUploader';

export const fileRouter = Router();

fileRouter.post('/upload', isAuthMiddleware, upload.single('file'), fileUploadHandler);
fileRouter.get('/:id', isAuthMiddleware, getFileHandler);
fileRouter.delete('/delete/:id', isAuthMiddleware, deleteFileHandler);
