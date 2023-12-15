import multer from 'multer';
import { diskStorage } from 'multer';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

export const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg',
    'image/png': 'png',
};

const storage = diskStorage({
    destination: (req, file, callback) => {
        const __dirname = dirname(fileURLToPath(import.meta.url));
        callback(null, join(__dirname, '../public/images'));
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    },
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});
export { upload }; 
export default upload;
