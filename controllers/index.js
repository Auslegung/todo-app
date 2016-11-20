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

router.post('/login', passport.authenticate('local', {failureRedirect: '/home'}), function(req, res){
    req.session.save(function(err){
    if (err) {
      return next(err);
    } // end if
    User.findOne({email: req.session.passport.email}).exec()
    .then(function(){
      res.redirect('/' + req.user._id + '/home');
    }) // end then
    .catch(function(err){
      console.log('ERROR:', err);
      res.head(400);
    }) // end catch
  }) // end req.session.save
});


module.exports = router;
