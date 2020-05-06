require("dotenv").config()

const server = require("./server.js")
const port = process.env.PORT || 5000;
const db = require("./db");


db.connect(process.env.MONGO_CONNECTION, err=> {
    if (err) {
        console.log("Unable to acquire db connection")
        process.exit(1)
    } else {
        server.listen(port, 
            _ => console.log(`\nListening on port ${port}\n`)
        )
    }
})
