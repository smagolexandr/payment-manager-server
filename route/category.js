var db = require('../config/db.js');

exports.list = function(req, res) {
  db.categoryModel.find({user: req.user._id}, function(err, results) {
    if (err) {
      console.log(err);
      return res.send(400);
    }

    return res.json(results);
  });
}

exports.create = function(req, res) {
  if (req.body.title === undefined) {
    return res.json(400);
  }

  var category = new db.categoryModel();
  category.title = req.body.title;
  category.user = req.user._id;

  category.save(function(err) {
    if (err) {
      console.log(err);
      return res.send(400);
    }

    return res.json(category);
  });
}

exports.delete = function(req, res) {
  if (req.params.categoryId === undefined) {
    return res.json(400);
  }

  var categoryId = req.params.categoryId;

  db.categoryModel.findOne({user: req.user._id, _id: categoryId}, function(err, result) {
    if (err) {
      console.log(err);
      return res.send(400);
    }

    result.remove();
    return res.send(200);
  });
}