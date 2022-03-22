const Item = require('../models/Item');
const Category = require('../models/Category');
const async = require('async');
const { body, validationResult } = require('express-validator');

exports.create_get = (req, res, next) => {
  res.send('Not implemented yet');
};

exports.create_post = (req, res, next) => {
  res.send('Not implemented yet');
};

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
