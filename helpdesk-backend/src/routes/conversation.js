import express from "express";
import { use } from "passport";
import { Conversation, User, ConversationBlock } from "../models";
import { replyToTweet } from "../twitter";

export const conversationRoutes = () => {
  const router = express.Router();

  router.get("/username/:username", async (req, res) => {
    const { username } = req.params;
    const user = await User.findOne({ username }).exec();
    if (!user) {
      return res.status(404).send("no user");
    }

    const conversations = await Conversation.find({ user: user._id });

    return res.status(200).send({ conversations });
  });

  router.post("/tweet/reply", async (req, res) => {
    const { username, comment, conversation_id } = req.body;
    const user = await User.findOne({ username }).exec();
    if (!user) {
      return res.status(404).send("no user");
    }

    const conversation = await Conversation.findById(conversation_id).exec();
    if (!conversation) {
      return res.status(404).send("no conversation");
    }

    const tweet = replyToTweet({
      status: comment,
      status_id: conversation.tweetId,
      accessToken: user.twitter.oauth_token,
      accessTokenSecret: user.twitter.oauth_token_secret,
    });

    const conversationBlock = await ConversationBlock.create({
      user: user._id,
      conversation: conversation._id,
      type: "twitter:reply",
      comment,
      tweetId: tweet.id_str,
      twitterUser: tweet.user,
    });

    return res.status(200).send({ status: true, reply: conversationBlock });
  });

  router.get("/:id", async (req, res) => {
    const { id } = req.params;

    const conversation = await Conversation.findById(id).exec();
    const conversationBlocks = await ConversationBlock.find({
      conversation: conversation._id,
    }).exec();
    return res.status(200).send({ conversation, conversationBlocks });
  });

  return router;
};
