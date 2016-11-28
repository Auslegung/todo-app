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
      newToDo.toDoId = Date.now().toString();

      user.toDos.push(new ToDo(newToDo));
      return user.save();
    })
    .then(function(data) {
      res.status(201).json({message: 'created'});
    })
    .catch(function(err) {
      console.error(err);
    });
});

//edit toDo
router.patch('/toDo/:toDoId', authorize, function(req,res) {
  console.log('in edit route, req.body is ', req.body);

  User.findById(req.user._id).exec()
  .then(function(user){
    if (!user) {
      res.status(400).json({message: 'user not found'});
      return;
    }

    user.toDos.forEach(function(toDo){
      if (toDo.toDoId === req.params.toDoId) {
        console.log('found a match');
        for (property in req.body.toDoData) {
          toDo[property] = req.body.toDoData[property];
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
  // console.log('req.body is:', req.body);
  // if (req.body.update === '') {
  //   User.findOneAndUpdate(
  //     {'_id': req.params.userId, 'toDos._id': req.params.toDoId},
  //     {$set: {
  //       'toDos.$.name': req.body.name,
  //       // 'toDos.$.image': req.body.image,
  //       'toDos.$.description': req.body.description,
  //       'toDos.$.new': req.body.new,
  //       'toDos.$.stillNeeded': req.body.stillNeeded,
  //       'toDos.$.registryType': 'baby'
  //     }}, // end $set:
  //     {upsert: true, returnNewDocument: true}
  //   ) // end User.findOneAndUpdate()
  //   .catch(function(err){
  //     console.log(err);
  //   })
  //   .then(function(updatedItem){
  //     res.redirect('/'+req.params.userId+'/home/')
  //   })
  // } // end if
  // else if (req.body.delete === '') {
    User.findOneAndUpdate(
      {'_id': req.user._id},
      {$pull: {'toDos': {'_id': req.params.toDoId}}
    })
    .catch(function(err){
      console.log(err);
    })
    .then(function(data){
      res.status(200).json(data.toDos);
    })
    .catch(function(err){
      console.log(err);
    });
  // } // end if
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
