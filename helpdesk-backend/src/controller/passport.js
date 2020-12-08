import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { User } from "../models";
import config from "../config";
// import TwitterStrategy from "passport-twitter";

// // serialize the user.id to save in the cookie session
// // so the browser will remember the user when login
// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// // deserialize the cookieUserId to user in the database
// passport.deserializeUser((id, done) => {
//   User.findById(id)
//     .then((user) => {
//       done(null, user);
//     })
//     .catch((e) => {
//       done(new Error("Failed to deserialize an user"));
//     });
// });

// passport.use(
//   new TwitterStrategy(
//     {
//       consumerKey: "JAABlOt9wzw9dyr8SASkPjRrj",
//       consumerSecret: "ki0m1aFKtdYisdalDQUOHnfOS0EI5XC1Iez1xbhx0Htox2NwrI",
//       callbackURL: "http://localhost:3000/auth/twitter/redirect",
//     },
//     async (token, tokenSecret, profile, done) => {
//       // find current user in UserModel
//       const currentUser = await User.findOne({
//         twitterId: profile._json.id_str,
//       });
//       // create new user if the database doesn't have this user
//       if (!currentUser) {
//         const newUser = await new User({
//           name: profile._json.name,
//           screenName: profile._json.screen_name,
//           twitterId: profile._json.id_str,
//           profileImageUrl: profile._json.profile_image_url,
//         }).save();
//         if (newUser) {
//           done(null, newUser);
//         }
//       }
//       done(null, currentUser);
//     }
//   )
// );

/**
 * jwt passport options
 */
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.jwtSecret;
opts.issuer = "accounts.richpanel-example.com";
opts.audience = "richpanel-example.com";
passport.use(
  "jwt",
  new JwtStrategy(opts, function (jwt_payload, done) {
    User.findOne({ id: jwt_payload.sub }, function (err, user) {
      if (err) {
        return done(err, false);
      }
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
        // or you could create a new account
      }
    });
  })
);

/**
 * twitter-strategy passport options
 */
passport.use(
  "twitter",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        const user = await User.create({
          email,
          password,
          ...req.body.details,
        });

        return done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

/**
 * local-strategy passport options
 */
passport.use(
  "signup",
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      try {
        const user = await User.create({
          username,
          password,
          ...req.body.details,
        });

        return done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

/**
 * local-strategy passport options
 */
passport.use(
  "login",
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
    },
    async (username, password, done) => {
      try {
        const user = await User.findOne({ username });

        if (!user) {
          return done(null, false, { message: "User not found" });
        }

        const validate = await user.isValidPassword(password);

        if (!validate) {
          return done(null, false, { message: "Wrong Password" });
        }

        return done(null, user, { message: "Logged in Successfully" });
      } catch (error) {
        return done(error);
      }
    }
  )
);
