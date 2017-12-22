var mongoose = require('mongoose'),
  bcrypt = require('bcrypt'),
  SALT_WORK_FACTOR = 10,
  uristring = 'mongodb://localhost/payments',
  mongoOptions = {
    useMongoClient: true
  };

mongoose.connect(uristring, mongoOptions,
  function (err, res) {
  if (err) {
    console.log('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
    console.log('Successfully connected to: ' + uristring);
  }
})

var Schema = mongoose.Schema;

// User schema
var User = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true}
});

var Category = new Schema({
  user: { type: Schema.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true }
});

var Payment = new Schema({
  user: { type: Schema.ObjectId, ref: 'User', required: true },
  category: { type: Schema.ObjectId, ref: 'Category', required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  description: { type: String }
});

// Bcrypt middleware on UserSchema
User.pre('save', function(next) {
  var user = this;

  if(!user.isModified('password')) return next();

  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if(err) return next(err);

    bcrypt.hash(user.password, salt, function(err, hash) {
      if(err) return next(err);
      user.password = hash;
      next();
    });
  });
});

//Password verification
User.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if(err) return cb(err);
    cb(null, isMatch);
  });
};

var userModel = mongoose.model('User', User),
  paymentModel = mongoose.model('Payment', Payment),
  categoryModel = mongoose.model('Category', Category);


// Export Models
exports.userModel = userModel;
exports.paymentModel = paymentModel;
exports.categoryModel = categoryModel;