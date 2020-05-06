const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const db = require("./db")


const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());
server.use(morgan("dev"));



server.get("/", (req,res) => {
    var collection = db.get().collection("users")
    console.log(collection)
    collection.find().toArray((err, docs) => {
        res.json({docs})
    })
})

module.exports = server;