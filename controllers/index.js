var express = require('express');
var router = express.Router();
var User = require('../models/user.js');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
require('../config/passport.js')(passport);
var jwt = require('jwt-simple');
var config = require('../config/database'); // get db config file


// SIGN UP ROUTE
router.post('/signup', function(req, res){
  if (!req.body.username || !req.body.password) {
    res.json({success: false, msg: 'Please input email and password.'});
  } else {
    var newUser = new User({
      username: req.body.username,
      password: req.body.password
    });
    // save the user
    newUser.save(function(err) {
      if (err) {
        return res.json({success: false, msg: 'Username already exists.'});
      }
      res.json({success: true, msg: 'Successfully created a new user.'});
    });
  }
});

// route to login a user
router.post('/login', function(req, res) {
  User.findOne({username: req.body.username}, function(err, user) {
    if (err) throw err;

    if (!user) {
      res.send({success: false, msg: 'Authentication failed. User not found.'});
    } else {
      // check if password matches
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          // if user is found and password is correct, create a token
          var token = jwt.encode(user, config.secret);
          // return the information including token as JSON
          res.json({success: true, token: 'JWT ' + token});
        } else {
          res.send({success: false, msg: 'Authentication failed. Incorrect password.'});
        }
      });
    }
  });
});


module.exports = router;
