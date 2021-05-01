const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
    username: String,
    password: String,
    permissions: [String]
})

module.exports = mongoose.model("Users", userSchema);