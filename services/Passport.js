const passport = require ('passport');
const LocalStrategy = require ('passport-local');
const JwtStrategy = require ('passport-jwt').Strategy;
const ExtraxctJwt = require ('passport-jwt').ExtractJwt;
const config = require ('../config');

const localOptions = {usernameField: 'email'};

let db;
let collection;
function col (req) {
  db = req.app.locals.db;
  collection = db.collection ('users');
}

const localLogin = new LocalStrategy (localOptions, function (
  email,
  password,
  done
) {
  //Verify email Password
  collection.findOne ({email: email}, function (err, user) {
    if (err) {
      return done (err);
    }
    if (!user) {
      return done (null, false);
    }
    //compare password
    comparePassword (password, function (err, isMatch) {
      if (err) {
        return done (err);
      }
      if (!isMatch) {
        return done (null, false);
      }
      return done (null, user);
    });
  });
});

//Setup Options
const jwtOptions = {
  jwtFromRequest: ExtraxctJwt.fromHeader ('authorization'),
  secretOrKey: config.key,
};

//Create JWT Strategy
const jwtLogin = new JwtStrategy (jwtOptions, function (payload, done) {
  collection.findById (payload.sub, function (err, user) {
    if (err) {
      return done (err, false);
    }
    if (user) {
      done (null, user);
    } else {
      done (null, false);
    }
  });
});

passport.use (jwtLogin);
passport.use (localLogin);

const comparePassword = function (candidatePassword, callback) {
  bcrypt.compare (candidatePassword, this.password, function (err, isMatch) {
    if (err) {
      return callback (err);
    }
    callback (null, isMatch);
  });
};
