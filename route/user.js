var passport = require('passport')
var db = require('../config/db')

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

exports.login =  passport.authenticate('local', { session: false }),
  function(req, res) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    return (req.user.username);
  }

exports.logout = function(req, res) {
  req.session = null
  req.logout()
  res.sendStatus(200)
}