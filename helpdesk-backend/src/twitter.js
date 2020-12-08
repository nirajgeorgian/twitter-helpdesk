import { TwitterClient } from "twitter-api-client";
import { Conversation } from "./models";
import config from "./config";

export const createTwitterClient = ({ accessToken, accessTokenSecret }) => {
  const twitterClient = new TwitterClient({
    apiKey: config.twitter.consumerKey,
    apiSecret: config.twitter.consumerSecret,
    accessToken,
    accessTokenSecret,
  });

  return twitterClient;
};

export const getUserTweets = async ({ id, accessToken, accessTokenSecret }) => {
  const twitterClient = createTwitterClient({ accessToken, accessTokenSecret });
  const userTweets = await twitterClient.tweets.statusesUserTimeline({});

  return userTweets;
};

export const insertTweets = async ({
  userId,
  id,
  accessToken,
  accessTokenSecret,
}) => {
  const userTweets = await getUserTweets({
    id,
    accessTokenSecret,
    accessToken,
  });

  for (let tweet of userTweets) {
    const conversation = await Conversation.findOneAndUpdate(
      { tweetId: tweet.id_str },
      {
        user: userId,
        tweetId: tweet.id_str,
        conversation: tweet.text,
        createdDate: tweet.created_at,
        twitterUser: tweet.user,
      },
      { upsert: true, new: true, runValidators: true }
    );
  }

  return userTweets;
};

export const replyToTweet = async ({
  status,
  status_id,
  accessToken,
  accessTokenSecret,
}) => {
  const twitterClient = createTwitterClient({ accessToken, accessTokenSecret });
  const tweetUpdated = await twitterClient.tweets.statusesUpdate({
    in_reply_to_status_id: status_id,
    auto_populate_reply_metadata: true,
    status,
  });

  return tweetUpdated;
};
