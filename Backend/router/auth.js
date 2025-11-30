const express = require('express');
require('../db/conn');
const cookieParser = require("cookie-parser");
const router = express.Router();
const User = require('../model/userSchema');
//Here we are not using ES6 version of importing or exporting things.
const { hashPassword, comparePassword } = require('../helper/authHelper');
const about = require('../middlewares/about');

router.get('/', (req, res) => {
   res.send(`Hello from router.js`);
})


//Router for Registration of a new User
router.post('/register', async (req, res) => {
   console.log(req.body);

   const { name, email, password, confirmpassword, country, city, address } = req.body;

   //Check if either of the param is empty or not
   if (!name || !email || !password || !confirmpassword || !country || !city || !address) {
      return res.status(401).json({ error: "Plz fill the details carefully" });
   }
   //Check if password and confirmpassword are same
   if (password !== confirmpassword) {
      return res.status(400).json({ error: "Please fill the details carefully" });
   }

   //Now check if the user signing up is unique or not
   const userExist = await User.findOne({ email: email });
   if (userExist) {
      return res.status(422).json({ error: "User already exists" });
   }

   //Now hash the password and confirmPassword
   const hashedPassword = await hashPassword(password);
   const confirmHashedpassword = await hashPassword(confirmpassword);

   //When key value pair is of same name then we don't write them again and again.
   const user = new User({
      name,
      email,
      password: hashedPassword,
      confirmpassword: confirmHashedpassword,
      country,
      city,
      address
   });

   //save it in the database(database errors starts from 500)
   const saved = await user.save();
   if (saved) {
      return res.status(201).json({ message: "Data successfuly stored in the database" });
   } else {
      return res.status(500).json({ message: "Registration Failed" });
   }
});


//Router for Login Credentials
router.post('/login', async (req, res) => {

   const { email, password } = req.body;
   if (!email || !password) {
      return res.status(422).json({ error: "Please fill all the credentiala" });
   }

   const userExist = await User.findOne({ email: email })
   if (!userExist) {
      return res.status(404).json({ message: 'Invalid Credentials' });
   }

   console.log(userExist);

   //Generate Token here on every login
   const generatedToken = await userExist.generateAuthToken();
   res.cookie("tokenize", generatedToken, {
      expires: new Date(Date.now() + 35000000),
      httpOnly: true
   });

   //Match the password
   const match = await comparePassword(password, userExist.password);
   if (match) {
      return res.status(201).json({ message: "Successfully Logged In", token: generatedToken });
   } else {
      return res.status(404).json({ message: 'Invalid Credentials' });
   }
});


// -------- FORGOT PASSWORD ROUTER --------
// Simple reset: user enters email + new password + confirm password
router.post('/forgotpassword', async (req, res) => {
   try {
      const { email, password, confirmpassword } = req.body;

      if (!email || !password || !confirmpassword) {
         return res.status(422).json({ error: "Please fill all the fields" });
      }

      if (password !== confirmpassword) {
         return res.status(400).json({ error: "Passwords do not match" });
      }

      const user = await User.findOne({ email });
      if (!user) {
         return res.status(404).json({ error: "No account found with this email" });
      }

      const hashedPassword = await hashPassword(password);
      const hashedConfirm = await hashPassword(confirmpassword);

      user.password = hashedPassword;
      user.confirmpassword = hashedConfirm;

      await user.save();

      return res.status(200).json({ message: "Password updated successfully" });
   } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Something went wrong while resetting password" });
   }
});


//Router for About Page
router.use(cookieParser());
router.get('/about', about, async (req, res) => {
   res.status(200).send(req.rootUser);
})

//Router for Post by a User
router.use(cookieParser());
router.post('/quote', about, async (req, res) => {
   const { name, message } = req.body;
   //Fetch the user who is sending this post by user's id which is stored in req.userId in the middleware as this request firstly reaches the middleware.
   if (!name || !message) {
      return res.status(404).send("Fill all the details");
   }
   const userDetailer = await User.findOne({ _id: req.userId });

   //Now call the function in the userSchema
   const data = await userDetailer.addMessenger(name, message);
   if (!data) {
      res.status(404).send({ message: "Post not saved" });
   } else {
      res.status(200).send(data);
   }
})


//Router for home Page
router.get('/getposts', async (req, res) => {
   const data = await User.find();
   console.log(data);
   res.status(200).send(data);
})

//Router for Logout Page
router.post('/logout', async (req, res) => {
   res.clearCookie('tokenize', { path: '/' });
   res.status(200).send('User LoggedOut');
})

module.exports = router;