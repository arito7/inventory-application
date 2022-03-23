const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// set storage engine
const storage = multer.diskStorage({
  destination: 'public/uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${file.originalname}`);
  },
});

// check file type
function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|gif/i;

  // check extension
  const extname = filetypes.test(path.extname(file.originalname));

  // check MIME Type
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Unsupported file type.');
  }
}

const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000 },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
});

const itemController = require('../controllers/itemController');
const categoryController = require('../controllers/categoryController');
// ITEM ROUTES

router.get('/', itemController.index);

router.get('/item/create', itemController.create_get);

router.post('/item/create', upload.single('image'), itemController.create_post);

router.get('/item/:id/update', itemController.update_get);

router.post(
  '/item/:id/update',
  upload.single('image'),
  itemController.update_post
);

router.get('/item/:id/delete', itemController.delete_get);

router.post('/item/:id/delete', itemController.delete_post);

router.get('/item/:id', itemController.detail_get);

router.get('/items', itemController.items_get);

// CATEGORY ROUTES

router.get('/category/create', categoryController.create_get);

router.post('/category/create', categoryController.create_post);

router.get('/category/:id/update', categoryController.update_get);

router.post('/category/:id/update', categoryController.update_post);

router.get('/category/:id/delete', categoryController.delete_get);

router.post('/category/:id/delete', categoryController.delete_post);

router.get('/category/:id', categoryController.detail_get);

router.get('/categories', categoryController.categories_get);

module.exports = router;
