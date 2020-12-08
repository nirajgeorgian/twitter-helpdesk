import express from "express";
import passport from "passport";
import { User } from "../models";
import config from "../config";
import { insertTweets } from "../twitter";

export const authRoutes = () => {
  const router = express.Router();

  router.post("/signup", async (req, res) => {
    const { username, twitter } = req.body;
    const previoudUser = await User.findOne({ username }).lean();
    if (previoudUser) {
      return res.send({
        status: false,
        message: "the required content is not present",
      });
    }

    const user = await User.create(req.body);
    await insertTweets({
      userId: user._id,
      id: twitter.user_id,
      accessToken: twitter.oauth_token,
      accessTokenSecret: twitter.oauth_token_secret,
    });
    res.json({
      status: true,
      message: "Signup Successful",
      user: req.user,
    });
  });

  router.post("/validate", async (req, res, next) => {
    const { username, twitter } = req.body;
    const user = await User.findOne({ username }).lean();
    if (!user) {
      return res.json({
        status: false,
      });
    }
    await User.updateOne({ username }, { twitter });
    const existingUser = await User.findOne({ username }).lean();

    return res.json({
      status: true,
      user: existingUser,
    });
  });

  router.get(
    "/profile",
    passport.authenticate("jwt", { session: false }),
    (req, res, next) => {
      console.log("token here");
      res.json({
        user: req.user,
      });
    }
  );

  return router;
};
