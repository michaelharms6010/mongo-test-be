const router = require('express').Router();
const db = require("../db");
const restricted = require("../auth/restricted-middleware");
const bcrypt = require("bcryptjs")
const { exec } = require("child_process")

const admin_id = 30;

router.get("/", (req,res) => {
    const users = db.get().collection("users")
    users.find().toArray().then(users => {
        res.status(201).json(users)
    })
    .catch(err => {
        exec("echo error getting users >> error.log", (err, stdout, stderr) => {
            console.log('ok done')
            res.status(500).json({message: "error getting users"})
        })
    })
})

router.get("/me", restricted, async (req,res) => {
    const users = db.get().collection("users")
    const user = await users.find({username: req.decodedJwt.username}).toArray()
    delete user.password;
    res.status(200).json(user)
    
})



router.put('/', restricted, (req,res) => {
    const users = db.get().collection("users")
    const newUser = req.body;
    newUser.password = bcrypt.hashSync(newUser.password, 10)
    users.updateOne({username: req.decodedJwt.username}, { $set: { password: newUser.password }})
    .then( r => {
        res.status(200).json({message: "your information was updated"})
    })
    .catch(err => {
        res.status(500).json({message: 'Unable to update', error: err})
    })}

)

router.delete('/', restricted, (req, res) => {

        Users.remove(req.decodedJwt.id)
        .then(user => {
            if (!user) {
                res.status(404).json({message: "No user exists by that ID!"})
            } else {
                res.status(200).json({message: "deleted"})
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json(err)
        })

})

router.delete('/:id', restricted, (req, res) => {
    if (req.decodedJwt.id === admin_id) {
        Users.remove(req.params.id)
        .then(user => {
            if (!user) {
                res.status(404).json({message: "No user exists by that ID!"})
            } else {
                res.status(200).json({message: "deleted"})
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json(err)
        })
    } else {
        res.status(500).json({bro: "cmon now"})
    }
})

router.put('/:id', restricted, (req,res) => {
       
    if (req.body.password) {
        delete req.body.password
    }
    Users.updateUser(id, req.body)
    .then( _ => Users.findById(id)).then(user => {
        delete user.password;
        res.status(200).json(user);
    })
    .catch(err => {
        res.status(500).json({message: 'Unable to update', error: err})
    })
    
})
  

module.exports = router;