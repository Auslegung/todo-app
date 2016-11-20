var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// var passportLocalMongoose= require('passport-local-mongoose');
var bcrypt = require('bcrypt');

var ToDoSchema = new Schema({
  title: String,
  notes: String,
  isComplete: Boolean,
  startDate: {type: Date, default: Date.now},
  dueDate: Date,
  createdAt: Date,
  updatedAt: Date
})

var UserSchema = new Schema({
  username: {type: String, unique: true, required: true},
  password: {type: String, required: true},
  toDos: [ToDoSchema],
  createdAt: Date,
  updatedAt: Date
});

UserSchema.pre('save', function (next) {
  var user = this;
  if (this.isModified('password') || this.isNew) {
    bcrypt.genSalt(10, function (err, salt) {
      if (err) {
        return next(err);
      }
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) {
          return next(err);
        }
        user.password = hash;
        next();
      });
    });
  } else {
    return next();
  }
});

UserSchema.methods.comparePassword = function (passw, cb) {
  bcrypt.compare(passw, this.password, function (err, isMatch) {
    if (err) {
      return cb(err);
    }
    cb(null, isMatch);
  });
};


// UserSchema.plugin(passportLocalMongoose);
var User = mongoose.model('User', UserSchema);

module.exports = User;
