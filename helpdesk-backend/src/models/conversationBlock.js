import mongoose from "mongoose";
const { Schema, model } = mongoose;

const conversationBlock = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  conversation: { type: Schema.Types.ObjectId, ref: "Conversation" },
  type: { type: String, required: true },
  comment: { type: String },
  createdDate: { type: Date, default: Date.now },
  tweetId: { type: String },
  twitterUser: { type: Object },
  externalIdentifier: { type: String },
});

export const ConversationBlock = model("ConversationBlock", conversationBlock);
export default ConversationBlock;
