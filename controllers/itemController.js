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
