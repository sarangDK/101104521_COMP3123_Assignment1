const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const JWT_SECRET = process.env.JWT_SECRET || 'qk1eo1ru12';



// post

router.post('/signup', [

  // validation for username, email and password 
  check('username').not().isEmpty().withMessage('Username is required'),
  check('email').isEmail().withMessage('you typed invalid email'),
  check('password').isLength({min: 8}).withMessage('Password must be at least 8 characters long')
], async (req, res) => {
  // checking for errors, and if there are errors, it will return a 400 status code
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()})
  }
  // destructuringusername, email and password from the request body
  const { username, email, password } = req.body;
  // try catch block to handle exceptions for creating a new user
  try { 
  // creating a new user but with hashed password
  const hashedPassword = await bcrypt.hash(password, 10);

  //  saving the user to the database
  const newUser = new User({ username, email, password: hashedPassword });
  const savedUser = await newUser.save();
  res.status(201).json({ message: "User Created Successfully", user_id: savedUser._id})
  } 
  catch(error) {
  res.status(500).json({ message: 'An error occured while creating user', error });

}  
});


  // Post login

  router.post('/login', [
    // validation to ensure that the email and password are not empty
    check('email').isEmail().withMessage('You typed an invalid email'),
    check('password').not().isEmpty().withMessage('Password is required')
  ], async (req, res) => {
    // validation for email and password
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()})
    }

    try {

      // find user with email
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    // comparing the password with the hashed password
    if (user && await bcrypt.compare(password, user.password)) {

      const token = jwt.sign({userId: user._id, email: user.email}, process.env.JWT_SECRET, {expiresIn: '2h'} );
      res.status(200).json({ message : "Login Successful.", jwt_token: token });

    } else {
      res.status(400).json({ status: false,  message: "password or username are wrong!" });
    }
  } catch(error) {
    res.status(500).json({message: 'Error occuered for logging in', error});
  }
});
  
module.exports = router;