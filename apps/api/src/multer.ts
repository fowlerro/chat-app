import * as multer from 'multer';
import * as path from 'path';

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'assets', 'avatars'));
  },
  filename: (req, file, cb) => {
    if (!req.session.user.id) return cb(new Error('Unauthorized'), '');
    const fileExtension = file.mimetype === 'image/gif' ? '.gif' : '.png';
    cb(null, req.session.user.id + fileExtension);
  },
});

const upload = multer({
  storage: multerStorage,
});

export default upload;
