const express = require('express');
const router = express.Router();

const itemController = require('../controllers/itemController');
const categoryController = require('../controllers/categoryController');
// ITEM ROUTES

router.get('/', itemController.index);

router.get('/item/create', itemController.create_get);

router.post('/item/create', itemController.create_post);

router.get('/item/:id/update', itemController.update_get);

router.post('/item/:id/update', itemController.update_post);

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
