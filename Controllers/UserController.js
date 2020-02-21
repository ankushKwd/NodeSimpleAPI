// const db = require ('../db');

// db.get ().collection ('users');

// console.log (cdb.get ());
// var collection = cdb.get ().collection ('users');

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
  col (req);
  collection.findOne (
    {_id: new ObjectId (request.params.id)},
    (error, result) => {
      if (error) {
        return response.status (500).send (error);
      }
      response.send (result);
    }
  );
};
exports.saveUser = function (request, response) {
  col (req);
  collection.insert (request.body, (error, result) => {
    if (error) {
      return response.status (500).send (error);
    }
    response.send (result.result);
  });
};
exports.deleteUser = function (request, response) {
  col (req);
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
