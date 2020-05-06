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
     res.status(200).json({message: "server is up"})
})

module.exports = server;