const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const MongoClient = require('mongodb').MongoClient

MongoClient.connect(process.env.MONGO_CONNECTION, {useUnifiedTopology: true}, (err, client) => {
    if (err) return console.error(err)
    console.log('Connected to Database')
})

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());
server.use(morgan("dev"));


server.get("/", (req,res) => {
    res.json({message: "Server is up and running"})
})

module.exports = server;