var express = require('express');
var router = express.Router();
var User = require('../models/user.js');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

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

module.exports = router;
