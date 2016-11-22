var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose= require('passport-local-mongoose');
ToDoSchema = require('./todo.js').schema;

var UserSchema = new Schema({
  username: {type: String, unique: true},
  password: String,
  toDos: [ToDoSchema],
  createdAt: {type: Date, default: Date.now},
  updatedAt: Date
});

UserSchema.plugin(passportLocalMongoose);
var User = mongoose.model('User', UserSchema);
var ToDo = mongoose.model('ToDo', ToDoSchema);

module.exports = User
