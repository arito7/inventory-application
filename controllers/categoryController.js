const Item = require('../models/Item');
const Category = require('../models/Category');
const async = require('async');
const { body, validationResult } = require('express-validator');
const consts = require('../consts');

const categoryValidationSchema = [
  body('name', 'Name must not be empty').trim().isLength({ min: 3 }).escape(),
];

const checkForPreexistingCategory = (req, res, next) => {
  Category.exists({ name: req.body.name }).exec((err, exists) => {
    if (err) {
      next(err);
    }
    if (exists) {
      const error = new Error(
        `The category "${req.body.name}" already exists.`
      );
      console.log(req.method, req.url);
      res.render('forms/category-form', {
        title: 'Create Category',
        errors: [error],
      });
    } else {
      next();
    }
  });
};

exports.create_get = (req, res, next) => {
  res.render('./forms/category-form', { title: 'Create Category' });
};

exports.create_post = [
  categoryValidationSchema,
  checkForPreexistingCategory,
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
  Category.findById(req.params.id).exec((err, category) => {
    if (err) {
      next(err);
    }
    res.render('forms/category-form', { title: 'Update Category', category });
  });
};

exports.update_post = [
  categoryValidationSchema,
  checkForPreexistingCategory,
  (req, res, next) => {
    Category.findByIdAndUpdate(req.params.id, { name: req.body.name }).exec(
      (err) => {
        if (err) {
          next(err);
        }
        res.redirect('/catalog/categories');
      }
    );
  },
];

exports.delete_get = (req, res, next) => {
  async.parallel(
    {
      category: (cb) => {
        Category.findById(req.params.id).exec(cb);
      },
      count: (cb) => {
        Item.find({ categories: { $all: req.params.id } }).count(cb);
      },
    },
    (err, results) => {
      if (err) {
        next(err);
      }
      res.render('delete/category-delete', {
        title: 'Delete Category',
        count: results.count,
        category: results.category,
      });
    }
  );
};

exports.delete_post = (req, res, next) => {
  if (
    req.body.username === consts.username &&
    req.body.password === consts.password
  ) {
    Category.findByIdAndDelete(req.params.id).exec((err) => {
      if (err) {
        next(err);
      }
      res.redirect('/catalog/categories');
    });
  } else {
    async.parallel(
      {
        category: (cb) => {
          Category.findById(req.params.id).exec(cb);
        },
        count: (cb) => {
          Item.find({ categories: { $all: req.params.id } }).count(cb);
        },
      },
      (err, results) => {
        if (err) {
          next(err);
        }
        const error = new Error('Invalid username or password');
        res.render('delete/category-delete', {
          title: 'Delete Category',
          category: results.category,
          count: results.count,
          errors: [error],
        });
      }
    );
  }
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
  async.parallel(
    {
      category: (cb) => {
        Category.findById(req.params.id).exec(cb);
      },
      category_items: (cb) => {
        Item.find({ categories: { $all: req.params.id } })
          .populate('categories')
          .exec(cb);
      },
    },
    (err, results) => {
      if (err) {
        next(err);
      }
      res.render('category', {
        title: `${results.category.name}`,
        category: results.category,
        category_items: results.category_items,
      });
    }
  );
};
