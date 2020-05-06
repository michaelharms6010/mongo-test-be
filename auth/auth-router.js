
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secret = require('../config/secrets');
const Users = require('./auth-model');
const db = require("./db")

 
router.post('/register',  (req, res) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password,10);
  user.password = hash;
  var collection = db.get().collection("users")
  collection.insertOne(user)
    .then(res => res.status(201).json(res))
    .catch(err => res.status(500).json(err))
});

router.post('/login', (req, res) => {
  let {username, password} = req.body;

  Users.findBy({username})
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
       const token = generateToken(user) 
       delete user.password;
        res.status(200).json({
         token
        });
      } else {
        res.status(401).json({message: "Invalid Credentials"})
      }
    })

});


function generateToken(user) {
  const payload = {
    username: user.username,
    id: user.id,
    
  };
  const options = {
    expiresIn: "42069d"
  };
  return jwt.sign(payload, secret.jwtSecret, options);
}

module.exports = router;
