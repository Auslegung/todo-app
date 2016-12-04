var express = require('express');
var router  = express.Router();
var User = require('../models/user.js');
var ToDo = require('../models/user.js');

var authorize = function(req, res, next) {
  if (!req.user) {
    res.status(401).json({message: 'unauthorized'});
  } else {
    next();
  }
}

//logout
router.get('/logout', function(req,res) {
  try {
    req.logout();
    res.status(200).json({message: 'logout successful'});
  } catch (e) {
    console.log(e);
  }
});

//add toDo
router.post('/:username', authorize, function(req,res) {
    User.findOne({username: req.user.username}).exec()
    .then(function(user){
      if (!user) {
        res.status(406).json({message: 'username not found'});
      } else {
        console.log('found ', user.username);
      }

      console.log('in add toDo, req.body is ', req.body);
      console.log('in add toDo, req.user is ', req.user);
      var newToDo = req.body.data;

      user.toDos.unshift(newToDo);
      return user.save();
    })
    .then(function(data) {
      res.status(201).json({data});
    })
    .catch(function(err) {
      console.error(err);
    });
});

//edit toDo
router.patch('/toDo/:toDoId', authorize, function(req,res) {
  User.findById(req.user._id).exec()
  .then(function(user){
    if (!user) {
      res.status(400).json({message: 'user not found'});
      return;
    }
    user.toDos.forEach(function(toDo){
      // toDo._id is an object, req.params.toDoId is a string.  It took me 5
      //  hours to figure this out.
      if (toDo._id.toString() == req.params.toDoId) {
        console.log('found a match');
        for (property in req.body.toDo) {
          toDo[property] = req.body.toDo[property];
        }
      }
    });

    return user.save();
  })
  .then(function(data) {
    //instead of sending {message: 'updated'}, we'll look for the user's
    //toDos and return those
    res.status(200).json({message: 'updated'});
  })
  .catch(function(err) {
    console.error(err);
  });
});

router.delete('/:userId/home/:toDoId', authorize, function(req, res){
    User.findOneAndUpdate(
      {'_id': req.user._id},
      {$pull: {'toDos': {'_id': req.params.toDoId}}},
      {new: true}
    )
    .catch(function(err){
      console.log(err);
    })
    .then(function(data){
      res.status(200).json(data.toDos);
    })
    .catch(function(err){
      console.log(err);
    });
});

module.exports = router;
