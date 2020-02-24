var MongoClient = require ('mongodb').MongoClient;

var state = {
  db: null,
};

exports.connect = function (url, done) {
  if (state.db) return done ();
  MongoClient.connect (url, {useUnifiedTopology: true}, function (err, client) {
    if (err) return err;

    // console.log (client);
    state.db = client;
  });
};

exports.get = function () {
  console.log (state);
  return state.db;
};

exports.close = function (done) {
  if (state.db) {
    state.db.close (function (err, result) {
      state.db = null;
      state.mode = null;
      done (err);
    });
  }
};
