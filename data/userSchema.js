const db = require("../db")

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