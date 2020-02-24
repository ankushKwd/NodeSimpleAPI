const bcrypt = require ('bcrypt-nodejs');
const jwt = require ('jwt-simple');
const config = require ('../config');
const ObjectId = require ('mongodb').ObjectID;

let db;
let collection;

function col (req) {
  db = req.app.locals.db;
  collection = db.collection ('users');
}

exports.getAllUsers = function (req, res) {
  col (req);
  collection.find ({}).toArray ((error, result) => {
    if (error) {
      return response.status (500).send (error);
    }
    res.send (result);
  });
};

exports.getOneUser = function (request, response) {
  col (request);
  collection.findOne (
    {_id: new ObjectId (request.params.id)},
    (error, result) => {
      console.log (result);
      if (error) {
        return response.status (500).send (error);
      }
      response.send ({token: tokenForUser (request.body)});
    }
  );
};

function tokenForUser (user) {
  const timestamp = new Date ().getTime ();
  return jwt.encode ({sub: user.emial, iat: timestamp}, config.key);
}

exports.saveUser = function (request, response, next) {
  col (request);

  bcrypt.genSalt (10, function (err, salt) {
    if (err) next (err);
    bcrypt.hash (request.body.password, salt, null, function (err, hash) {
      if (err) next (err);
      request.body.password = hash;
    });
  });

  collection.insertOne (request.body, (error, result) => {
    if (error) {
      return response.status (500).send (error);
    } else {
      return response.json ({token: tokenForUser (request.body)});
    }
  });
};

exports.deleteUser = function (request, response) {
  col (request);
  collection.findOne (
    {_id: new ObjectId (request.params.id)},
    (error, result) => {
      if (error) {
        return response.status (500).send (error);
      }
      collection.remove ();
      response.send (result);
    }
  );
};

exports.updateUser = function (req, res) {
  col (req);
  var updateObject = req.body; // {last_name : "smith", age: 44}
  var id = req.params.id;
  collection.update ({_id: ObjectId (id)}, {$set: updateObject});
  res.send (updateObject);
};
