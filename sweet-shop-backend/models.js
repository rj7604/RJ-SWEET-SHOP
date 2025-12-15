const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  role: { type: String, default: "user" }
});

const SweetSchema = new mongoose.Schema({
  name: String,
  category: String,
  price: Number,
  quantity: Number
});

module.exports = {
  User: mongoose.model("User", UserSchema),
  Sweet: mongoose.model("Sweet", SweetSchema)
};
