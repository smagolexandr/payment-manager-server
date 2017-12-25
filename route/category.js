var db = require('../config/db.js');

exports.list = function(req, res) {
  console.log(req.user)
  db.categoryModel.find({user: req.get('X-AUTH-TOKEN')}, function(err, results) {
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
  category.title = req.body.title
  category.user = req.get('X-AUTH-TOKEN')

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

  db.categoryModel.findOne({ user: req.get('X-AUTH-TOKEN'), _id: req.params.categoryId }, function(err, result) {
    if (err || !result) {
      console.log(err);
      return res.send(400);
    }

    result.remove();
    return res.send(200);
  });
}