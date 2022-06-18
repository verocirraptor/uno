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
    clientID: "989156031173-4oilhne5qb8c5otdgb8bg974il27shpg.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "https://juegodeluno-app.herokuapp.com/google/callback"
},
    function (token, tokenSecret, profile, done) {
        //User.findOrCreate({ googleId: profile.id }, function (err, user) {
            return done(null, profile);
        //});
    }
));