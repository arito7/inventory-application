const Item = require('../models/Item');
const Category = require('../models/Category');
const async = require('async');
const { body, validationResult } = require('express-validator');

exports.index = function (req, res) {
  async.parallel(
    {
      items: (cb) => {
        Item.find(cb);
      },
      categories: (cb) => {
        Category.find(cb);
      },
    },
    (err, results) => {
      res.render('index', {
        title: 'Fake Inventory',
        items: results.items,
        categories: results.categories,
        error: err,
      });
    }
  );
};

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

exports.items_get = (req, res, next) => {
  res.send('Not implemented yet');
};

exports.detail_get = (req, res, next) => {
  res.send('Not implemented yet');
};
