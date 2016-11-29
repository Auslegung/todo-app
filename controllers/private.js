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
  // User.findByIdAndUpdate(
  //   req.user._id,
  //   {$push: {"toDos": {title: title, notes: notes, dateDue: dateDue, updatedAt: Date.now()}}},
  //   {new: true}
  // )
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
  console.log('req.user is:', req.user);
  console.log('req.params.toDoId is:', req.params.toDoId);

  // User.findOneAndUpdate(
  //   {'_id': req.user._id, 'toDo._id': req.params.toDoId},
  //   {$set: {
  //     'toDo.$.title': req.body.title,
  //     'toDo.$.notes': req.body.notes,
  //     'toDo.$.isComplete': req.body.isComplete,
  //     'toDo.$.dateStart': req.body.dateStart,
  //     'toDo.$.dateDue': req.body.dateDue,
  //   }}, // end $set:
  //   {upsert: true, new: true}
  // ) // end User.findOneAndUpdate()
  // .then(function(user){
  //   return user.save();
  // })
  // .catch(function(err){
  //   console.log(err);
  // })
  // .then(function(user) {
  //   res.status(200).json({user: user});
  // })

  User.findById(req.user._id).exec()
  .then(function(user){
    if (!user) {
      res.status(400).json({message: 'user not found'});
      return;
    }
    user.toDos.forEach(function(toDo){
      // toDo._id is an object, req.params.toDoId is a string.  It took me 5
      // fucking hours to figure this out.
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

router.delete('/:userId/home/:toDoId', function(req, res){
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

//delete toDo
// router.delete('/toDo/:toDoId', authorize, function(req,res) {
//   User.findById(req.user._id).exec()
//   .then(function(user){
//     if (!user) {
//       res.status(400).json({message: 'user not found'});
//       return;
//     }
//     var removeToDoAt = user.toDos.findIndex(function(toDo){
//       console.log('toDo._id is:         ', toDo._id);
//       console.log('req.params.toDoId is:', req.params.toDoId);
//       if (toDo._id === req.params.toDoId) {
//         return 1;
//       }
//       return -1;
//     });
//     if (removeToDoAt !== -1) {
//       user.toDos.splice(removeToDoAt, 1);
//     }
//     console.log('removeToDoAt is:', removeToDoAt);
//     return user.save();
//   })
//   .then(function(data) {
//     console.log('removed the toDo');
//     res.status(200).json(data.toDos);
//   })
//   .catch(function(err) {
//     console.error(err);
//   });
// });

module.exports = router;
