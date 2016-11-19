var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose= require('passport-local-mongoose');

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
  username: String,
  password: String,
  toDos: [ToDoSchema],
  createdAt: Date,
  updatedAt: Date
});

UserSchema.plugin(passportLocalMongoose);
var User = mongoose.model('User', UserSchema);

module.exports = User;
