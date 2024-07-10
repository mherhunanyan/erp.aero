import multer from 'multer';

export const parseFormDataInBody = multer().none;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});
export const upload = multer({ storage });
