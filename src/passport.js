const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
  
passport.serializeUser((user , done) => {
    done(null , user);
})
passport.deserializeUser(function(user, done) {
    done(null, user);
});
  
passport.use(new GoogleStrategy({
    clientID:"12361215095-bo365rfaook7oaboh9h76tllr61mo5jg.apps.googleusercontent.com", // Your Credentials here.
    clientSecret:"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", // Your Credentials here.
    callbackURL:"http://localhost:3000/callback",
    passReqToCallback:true,
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(request, accessToken, refreshToken, profile, done) {
    console.log("request: ",request,"accessToken: ", accessToken,"refreshToken: ", refreshToken,"profile: ", profile)
    profile.accessToken = accessToken;
    return done(null, profile);
  }
));