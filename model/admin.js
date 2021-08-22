const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema({
  password: {
    type: String,
    required: true,
  },
  token: {
    type: String,
  },
});

adminSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }

  next();
});

module.exports = mongoose.model("Admin", adminSchema);
