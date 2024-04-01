const mongoose = require("mongoose");
const mongourl = process.env.MONGO_URI

module.exports = function db(){
    try {
        mongoose.connect(mongourl);
    } catch (e) {
        console.log("could not connect");
    }
    const dbConnection = mongoose.connection;
    dbConnection.on("error", (err) => console.log(`Connection error ${err}`));
    dbConnection.once("open", () => console.log("Connected to DB!"));
}

