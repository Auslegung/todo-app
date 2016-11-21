var express = require('express');
var router = express.Router();
var User = require('../models/user.js');
var passport = require('passport');
var User = require('../models/user');
// var LocalStrategy = require('passport-local').Strategy;

// SIGN UP ROUTE
router.post('/signup', function(req, res){
  User.register(new User({
    username: req.body.username,
    toDos: [],
    createdAt: Date.now(),
    // updatedAt: Date.now(),
    }),
    req.body.password,
    function(err, user) {
      if (err) {
        res.status(406).json({ message: err });
      } else {
        res.status(200).json({ message: 'user created'});
      }
    }); // end router.post
});

router.post('/login', passport.authenticate('local'), function(req, res) {
  req.session.save(function(err) {
    if (err) {
      res.status(406).json({ message: err});
    } else {
      User.findOne( {username: req.body.username} ).exec()
        .then(function(user) {
          res.status(200).json({ message: 'successful login', user: user});
        })
    }
  });
});

router.get('/user/:userId/todos', function(req, res) {
  // console.log(req);
  User.findById(req.user._id).exec()
    .then(function(data) {
      res.status(200).json(data.todos)
    })
    .catch(function(err) {
      console.log(err);
    });
})

router.get('/logout', function(req, res) {
  try {
    req.logout();
    res.status(200).json({message: 'logout successful'});
  } catch(err) {
    console.log(err);
  }
});

router.post('/')


module.exports = router;
