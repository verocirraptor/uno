const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    //User.findById(id, function(err, user) {
    done(null, user);
    //});
});

passport.use(new GoogleStrategy({
    clientID: "240617624599-m717fdp7qk0vvc75fc12n1lk940toqo2.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "https://juegodeluno-app.herokuapp.com/google/callback"
},
    function (token, tokenSecret, profile, done) {
        //User.findOrCreate({ googleId: profile.id }, function (err, user) {
            return done(null, profile);
        //});
    }
));