const Item = require('../models/Item');
const Category = require('../models/Category');
const async = require('async');
const { body, validationResult } = require('express-validator');

const itemValidationSchema = [
  body('name', 'Item name must not be empty')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Item name must be at least 3 characters long.')
    .trim()
    .escape(),
  body('categories.*').trim().escape(),
  body('price')
    .isCurrency({
      digits_after_decimal: [1, 2],
      require_decimal: false,
      require_symbol: false,
    })
    .trim()
    .escape(),
  body('number_in_stock')
    .isNumeric()
    .withMessage('Stock count must be a number')
    .isInt({ min: 0 })
    .withMessage('The minimum stock is 0')
    .trim()
    .optional()
    .escape(),
];

exports.index = function (req, res) {
  async.parallel(
    {
      items: (cb) => {
        Item.find().populate('categories').exec(cb);
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
  Category.find((err, categories) => {
    if (err) {
      next(err);
    }
    res.render('./forms/item-form', { title: 'Add New Item', categories });
  });
};

exports.create_post = [
  itemValidationSchema,
  (req, res, next) => {
    const errors = validationResult(req);

    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      categories: req.body.categories,
      price: req.body.price,
      number_in_stock: req.body.number_in_stock,
    });

    if (!errors.isEmpty()) {
      console.log('There were errors:', errors.array());
      Category.find((err, categories) => {
        if (err) {
          next(err);
        }
        res.render('forms/item-form', {
          title: 'Add New Item',
          item,
          categories,
          errors: errors.array(),
        });
      });
    } else {
      item.save((err) => {
        if (err) {
          next(err);
        }
        res.redirect('/catalog/items');
      });
    }
  },
];

exports.update_get = (req, res, next) => {
  async.parallel(
    {
      item: (cb) => {
        Item.findById(req.params.id).populate('categories').exec(cb);
      },
      categories: (cb) => {
        Category.find(cb);
      },
    },
    (err, results) => {
      if (err) {
        next(err);
      }
      results.categories.forEach((c) => {
        if (
          results.item.categories.findIndex(
            (i) => i._id.toString() === c._id.toString()
          ) > -1
        ) {
          c.checked = true;
        }
      });
      res.render('forms/item-form', {
        title: 'Update Item',
        item: results.item,
        categories: results.categories,
      });
    }
  );
};

exports.update_post = [
  (req, res, next) => {
    if (!(req.body.categories instanceof Array)) {
      if (typeof req.body.categories === 'undefined') {
        req.body.categories = [];
      } else {
        req.body.categories = new Array(req.body.categories);
      }
    }
    next();
  },
  itemValidationSchema,
  (req, res, next) => {
    console.log(req.body.categories);
    const errors = validationResult(req);
    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      categories:
        typeof req.body.categories === 'undefined' ? [] : req.body.categories,
      price: req.body.price,
      number_in_stock: req.body.number_in_stock,
      _id: req.params.id,
    });
    if (errors.isEmpty()) {
      Item.findByIdAndUpdate(req.params.id, item)
        .populate('categories')
        .exec((err, theItem) => {
          if (err) {
            next(err);
          }
          res.render('item', { title: 'Item Updated', item: theItem });
        });
    } else {
      res.render('item-form', { title: 'Update Item', item, errors });
    }
  },
];

exports.delete_get = (req, res, next) => {
  Item.findById(req.params.id)
    .populate('categories')
    .exec((err, item) => {
      if (err) {
        next(err);
      }
      res.render('./delete/item-delete', { title: 'Delete Item', item });
    });
};

exports.delete_post = (req, res, next) => {
  Item.findByIdAndDelete(req.params.id).exec((err) => {
    if (err) {
      next(err);
    }
    res.redirect('/catalog/items');
  });
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
      if (err) {
        return next(err);
      }
      res.render('item', { title: 'Item Details', item: item });
    });
};
