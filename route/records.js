var db = require('../config/db.js');

exports.create = function(req, res) {
  if (req.body.amount === undefined || isNaN(Number(req.body.amount)) || req.body.category === undefined || req.body.date === undefined
    || req.body.is_expense === undefined || req.params.accountId === undefined) {
    return res.json(400, {message:"Bad Data"});
  }

  var userId = req.params.userId;

  //TODO Check if user_id == account.user_id before adding the record.

  var record = new db.recordModel();
  record.user_id = req.user._id;
  record.amount = req.body.amount;
  record.category	= req.body.category;
  record.date	= req.body.date;
  record.description = req.body.description;

  record.save(function(err) {
    if (err) {
      console.log(err);
      return res.send(400);
    }
    return res.send(200);
  });
};

exports.delete = function(req, res) {
  if (req.params.userId === undefined || req.params.recordId === undefined) {
    return res.json(400, {message:"Bad Data"});
  }

  var recordId = req.params.recordId;
  var userId = req.params.userId;

  db.recordModel.findOne({_id: recordId, account_id: accountId, user_id: req.user._id}, function(err, record) {
    if (err) {
      console.log(err);
      return res.send(400);
    } else {
      return res.send(200);
    }
  });
};
