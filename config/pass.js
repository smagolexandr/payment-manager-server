var passport = require('passport')
  , Strategy = require('passport-local').Strategy
  , db = require('./db'),
  uuidv4 = require('uuid/v4');

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  db.userModel.findById(id, function (err, user) {
    done(err, user);
  });
});



passport.use('local',new Strategy(function(username, password, done) {
    db.userModel.findOne({ username: username}, function(err, user) {
    if (err) { return done(err); }
    if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
    user.comparePassword(password, function(err, isMatch) {
      if (err) return done(err);
      if(isMatch) {
        db.userModel.update(user, function(err){
          if(err) {return next(err);}
          // we store the updated information in req.user again
          user = {
            token: uuidv4()
          };
          return done(null, user);
        })
      } else {
        return done(null, false, { message: 'Invalid password' });
      }
    });
  });
}));

//Middleware to check if user is authenticated
exports.userIsAuthenticated = function userIsAuthenticated(req, res, next) {
  if (db.userModel.findOne({ token: req.get('X-AUTH-TOKEN') })) { return next(); }
  res.send(401);
};
//
// //TODO Create autorization (middleware ?).
exports.userIsAutorized = function userIsAutorized(objectUserId) {
  return (req.user._id == objectUserId);
}