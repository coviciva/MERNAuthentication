//kako izgleda user u DB
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  passwordHash: { type: String, required: true },
});

//modeli veliko slovo
//mongoose stvara kolekciju users, ispod je 1 user
const User = mongoose.model("user", userSchema);

module.exports = User;
