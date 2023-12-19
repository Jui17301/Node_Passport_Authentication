
const express = require('express');
const userRouter = express.Router();
const bcrypt = require('bcrypt')
const passport = require('passport');
// user model
const User = require("../models/User")
// Login Page
userRouter.get('/login',(req,res)=>{
  res.render('Login')
})
// Register Page :get
userRouter.get('/register',(req,res)=>{
  res.render('Register')
})
// Register Handle : post

userRouter.post('/register', (req, res) => {
 
  const {name, email, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    // Validation passed
    // res.send('Pass');
    User.findOne({ email: email })
    .then(user => {
      if (user) {
        // User exists
        errors.push({ msg: 'Email is already registered' });
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2
        });
      } 
      else {
        const newUser = new User({
          name,
          email,
          password
        });
//Hash Password

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save()
            
              .then(user => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                res.redirect('/users/login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
}
);
// Login
userRouter.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
userRouter.get('/logout', (req, res) => {
  req.logout((err)=>{
    if(err){
     return next(err)
    }
  });
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});


module.exports = userRouter;