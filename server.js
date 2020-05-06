const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const db = require("./db")

const authRouter = require("./auth/auth-router");

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());
server.use(morgan("dev"));

server.use("/auth", authRouter)

server.get("/", (req,res) => {
    db.get().createCollection("users", {
        validator: {
           $jsonSchema: {
              bsonType: "object",
              required: [ "username", "password"],
              uniqueItems: true,
              properties: {
                 username: {
                    bsonType: "string",
                    description: "must be a string and is required"
                 },
                 password: {
                    bsonType: "string",
                    description: "must be a string and is required"
                 },
              }
           }
        }
     })
     res.status(200).json({message: "done"})
})

module.exports = server;