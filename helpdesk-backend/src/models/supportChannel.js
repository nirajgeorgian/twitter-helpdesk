import mongoose from "mongoose";
const { Schema, model } = mongoose;

const supportChannel = new Schema({
  name: { type: String, unique: true, required: true },
  type: { type: String, required: true },
  externalIdentifier: { type: String },
});

SupportChannel.index({ name: 1 });
export const SupportChannel = model("SupportChannel", supportChannel);
export default SupportChannel;
