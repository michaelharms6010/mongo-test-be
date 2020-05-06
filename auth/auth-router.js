
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secret = require('../config/secrets');
const db = require("../db")

 
router.post('/register', (req, res) => {
  let user = req.body;
  const collection = db.get().collection("users")
  collection.find({username: user.username}).toArray()
  .then(found => {
    if (found.length) {
      res.status(400).json({message: "That user already exists."})
    } else {
      const hash = bcrypt.hashSync(user.password,10);
      user.password = hash;
      collection.insertOne(user)
        .then(user => {
          [newUser] = user.ops;
          delete newUser.password;
          const token = generateToken(newUser)
          res.status(201).json({message: `Created user ${newUser.username}`, token})
        })
      
        .catch(err => res.status(500).json(err))
      }
    })
});

router.post('/login', (req, res) => {
  let {username, password} = req.body;
  const collection = db.get().collection("users")
  collection.find({username}).toArray((err, docs) =>{
      if (err) {
        res.status(500).json(err)
      } else {
        const [newUser] = docs;
        delete newUser.password;
        const token = generateToken(newUser)
        res.status(200).json(token)
      }
    })
});


function generateToken(user) {
  const payload = {
    username: user.username,
    _id: user._id,
  };
  const options = {
    expiresIn: "42069d"
  };
  return jwt.sign(payload, secret.jwtSecret, options);
}

module.exports = router;
