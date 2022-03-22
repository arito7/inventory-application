const Item = require('../models/Item');
const Category = require('../models/Category');
const async = require('async');
const { body, validationResult } = require('express-validator');

const genreValidationSchema = [
  body('name', 'Name must not be empty').trim().isLength({ min: 3 }).escape(),
];

exports.create_get = (req, res, next) => {
  res.render('./forms/category-form', { title: 'Create Category' });
};

exports.create_post = [
  genreValidationSchema,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('./forms/category-form', {
        title: 'Create Category',
        errors: errors.array(),
      });
    }
    const category = new Category({
      name: req.body.name,
    });
    category.save((err) => {
      if (err) {
        next(err);
      }
      res.redirect('/catalog/categories');
    });
  },
];

exports.update_get = (req, res, next) => {
  res.send('Not implemented yet');
};

exports.update_post = (req, res, next) => {
  res.send('Not implemented yet');
};

exports.delete_get = (req, res, next) => {
  res.send('Not implemented yet');
};

exports.delete_post = (req, res, next) => {
  res.send('Not implemented yet');
};

exports.categories_get = (req, res, next) => {
  Category.find((err, results) => {
    if (err) {
      return next(err);
    }
    res.render('categories', {
      title: 'Categories',
      categories: results,
    });
  });
};

exports.detail_get = (req, res, next) => {
  res.send('Not implemented yet');
};
