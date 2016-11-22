var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ToDoSchema = new Schema({
  title: String,
  notes: String,
  isComplete: {type: Boolean, default: false},
  dateStart: {type: Date, default: Date.now},
  dateDue: Date,
  createdAt: {type: Date, default: Date.now},
  updatedAt: Date
})

var ToDo = mongoose.model('ToDo', ToDoSchema);

module.exports = ToDo;
