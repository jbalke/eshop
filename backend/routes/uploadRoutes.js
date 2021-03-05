import express from 'express';
import multer from 'multer';
import path from 'path';
import { requireAuth, authRoles } from '../middleware/authMiddleware.js';
import { ROLE } from '../permissions/roles.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  }

  cb(new Error('Only JPG and PNG supported!'));
}

const upload = multer({
  storage,
  fileFilter(req, file, cb) {
    checkFileType(file, cb);
  },
});

router.post(
  '/',
  requireAuth,
  authRoles([ROLE.ADMIN, ROLE.MANAGER]),
  upload.single('image'),
  (req, res) => {
    // convert back slashes on windows
    const path = req.file.path.replace(/\\/g, '/');
    res.send(`/${path}`);
  }
);

export default router;
