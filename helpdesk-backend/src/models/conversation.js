import mongoose from "mongoose";
const { Schema, model } = mongoose;

const conversation = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  conversation: { type: String },
  createdDate: { type: Date },
  tweetId: { type: String },
  lastConversationBlock: { type: Schema.Types.ObjectId, ref: "SupportChannel" },
  twitterUser: { type: Object },
});

export const Conversation = model("Conversation", conversation);
export default Conversation;
