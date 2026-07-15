const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true },


  email: { type: String, required: true, unique: true },


  password: { type: String, required: true },

  address: { type: String },


  membershipNumber: { type: String, unique: true, uppercase: true },


  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }

  
}, { timestamps: true });

memberSchema.pre("save", async function () {
  if (!this.membershipNumber) {
    const count = await mongoose.model("Member").countDocuments();
    this.membershipNumber = `LIB${String(count + 1).padStart(4, "0")}`;
  }
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  
});


memberSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("Member", memberSchema);


