var passport = require('passport')
var db = require('../config/db')

exports.register = function(req, res) {
  if (req.user) {
    return res.send(400)
  }

  if (req.body.username === undefined || req.body.password === undefined) {
    return res.send(400)
  }

  var user = new db.userModel()
  user.username = req.body.username
  user.password = req.body.password

  user.save(function(err) {
    if (err) {
      console.log(err)
      return res.send(400)
    }

    return res.send(200)
  })
}

exports.login = function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err) }
    if (!user) {
      return res.json(400, {message: "Bad User"})
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err)
      }
      return res.send({
        user: {
          _id: user._id,
          username: user.username
        }
      })
    })
  })(req, res, next)
}

exports.logout = function(req, res) {
  req.session.destroy()
  req.logout()
  res.send(200)
}