import passport from "passport";
import { OAuth2Strategy } from "passport-google-oauth";

passport.use(
  "auth-google",
  new OAuth2Strategy(
    {
      clientID:
        "992897367624-u641jeh6fm5bfrpavu5d50mvje3h12hn.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:3000/auth/google",
    },
    function (accessToken, refreshToken, profile, done) {
      const userProfile = profile;
      done(null, userProfile);
    }
  )
);
