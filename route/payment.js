var db = require('../config/db.js');

exports.list = function(req, res) {
  db.paymentModel.find({user: req.user._id}, function(err, results) {
    if (err) {
      console.log(err);
      return res.send(400);
    }

    return res.json(results);
  });
}

exports.monthly = function(req, res) {

  db.paymentModel.aggregate([
    {
      $match: {
        user: req.user._id
      }
    },
    {
      $group: {
        _id: "$category",
        sum : { "$sum": "$amount" }
      }
    }
  ], function(err, results) {
    if (err) {
      console.log(err);
      return res.send(400);
    }

    return res.json(results);
  });
}

exports.create = function(req, res) {
  if (req.body.amount === undefined || isNaN(Number(req.body.amount)) || req.body.category === undefined || req.body.date === undefined || req.user === undefined) {
    return res.json(400, {message:"Bad Data"});
  }

  var userId = req.params.userId;

  //TODO Check if user_id == account.user_id before adding the payments

  var payment = new db.paymentModel();
  payment.user = req.user._id;
  payment.amount = req.body.amount;
  payment.category	= req.body.category;
  payment.date	= req.body.date;
  payment.description = req.body.description;

  payment.save(function(err) {
    if (err) {
      console.log(err);
      return res.send(400);
    }
    return res.send(payment);
  });
};

exports.delete = function(req, res) {
  if (req.params.userId === undefined || req.params.paymentId === undefined) {
    return res.json(400, {message:"Bad Data"});
  }

  var paymentId = req.params.paymentId;

  db.paymentModel.findOne({_id: paymentId, user: req.user._id}, function(err, payment) {
    if (err) {
      console.log(err);
      return res.send(400);
    } else {
      payment.remove();
      return res.send(200);
    }
  });
};
