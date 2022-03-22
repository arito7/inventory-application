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
  async.parallel(
    {
      items: (cb) => {
        Item.find().populate('categories').exec(cb);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      res.render('items', { title: 'Items', items: results.items });
    }
  );
};

exports.detail_get = (req, res, next) => {
  Item.findById(req.params.id)
    .populate('categories')
    .exec((err, item) => {
      console.log(err);
      if (err) {
        return next(err);
      }
      res.render('item', { title: 'Item Details', item: item });
    });
};
