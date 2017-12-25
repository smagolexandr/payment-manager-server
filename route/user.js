const passport = require('passport'),
  db = require('../config/db')

exports.register = function(req, res) {
  if (req.user) {
    return res.sendStatus(400)
  }

  if (req.body.username === undefined || req.body.password === undefined) {
    return res.sendStatus(400)
  }

  var user = new db.userModel()
  user.firstName = req.body.firstName
  user.lastName = req.body.lastName
  user.username = req.body.username
  user.password = req.body.password

  user.save(function(err) {
    if (err) {
      console.log(err)
      return res.sendStatus(400)
    }

    return res.sendStatus(200)
  })
}

exports.login = function(req, res, next) {
  passport.authenticate('local', { "session": false }, function(err, user, info) {
    if (err) { return next(err) }
    if (!user) {;
      return res.json(400, {message: "Bad User"});
    }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.send({'user':
        {
          'token': user._id,
          'firstName': user.firstName,
          'lastName': user.lastName,
          'username': user.username
        }
      });
    });
  })(req, res, next);
};