import mongoose from "mongoose";
import bcrypt from "bcrypt";
const { Schema, model } = mongoose;

const user = new Schema({
  firstName: { type: String },
  lastName: { type: String },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  twitter: { type: Object },
});

user.pre("save", async function (next) {
  if (this.password) {
    const userSchema = this;
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
  }
  next();
});

user.methods.isValidPassword = async function (password) {
  const userSchema = this;
  const isValid = await bcrypt.compare(password, userSchema.password);

  return isValid;
};

export const User = model("User", user);
export default User;
