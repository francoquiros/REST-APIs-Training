const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");

const dotenv = require("dotenv").config();
const UserModel = require("../users/models/user");

passport.use(
  new localStrategy(
    {
      usernameField: "username"
    },
    async (username, password, done) => {
      try {
        const user = await UserModel.findOne({ username });
        if (!user) return done(null, false, { message: "User not found" });

        const validPassword = await user.validatePassword(password);
        if (!validPassword)
          return done(null, false, { message: "Wrong Password" });

        done(null, user, {
          message: "Logged in Successfully"
        });
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromHeader("authorization"),
      secretOrKey: process.env.TOKEN_SECRET
    },
    async (token, done) => {
      try {
        const user = await UserModel.findOne({ username: token.username });
        if (!user) return done(null, false, { message: "User not found" });
        done(null, user);
      } catch (error) {
        console.log(error);
        done(error);
      }
    }
  )
);
