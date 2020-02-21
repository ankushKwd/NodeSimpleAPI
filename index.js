const express = require ('express');
const bodyParser = require ('body-parser');
const morgan = require ('morgan');
const MongoClient = require ('mongodb').MongoClient;
const ObjectId = require ('mongodb').ObjectID;
const cors = require ('cors');
const app = express ();
app.use (cors ());
app.use (morgan ('combined'));
app.use (bodyParser.json ());
app.use (bodyParser.urlencoded ({extended: false}));

const port = process.env.PORT || 8080;
const url = 'mongodb://localhost:27017/Test';
const dbName = 'Test';
var database, collection;

app.get ('/users', (req, res) => {
  collection.find ({}).toArray ((error, result) => {
    if (error) {
      return response.status (500).send (error);
    }
    res.send (result);
  });
});

app.post ('/users', (request, response) => {
  collection.insert (request.body, (error, result) => {
    if (error) {
      return response.status (500).send (error);
    }
    response.send (result.result);
  });
});

app.get ('/users/:id', (request, response) => {
  collection.findOne (
    {_id: new ObjectId (request.params.id)},
    (error, result) => {
      if (error) {
        return response.status (500).send (error);
      }
      response.send (result);
    }
  );
});

app.delete ('/users/:id', (request, response) => {
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
});

app.patch ('/users/:id', (req, res) => {
  var updateObject = req.body; // {last_name : "smith", age: 44}
  var id = req.params.id;
  collection.update ({_id: ObjectId (id)}, {$set: updateObject});
  res.send (updateObject);
});

app.listen (port, () => {
  console.log ('Server is listening on port', port);
  MongoClient.connect (url, {useUnifiedTopology: true}, (error, client) => {
    if (error) {
      throw error;
    }
    database = client.db (dbName);
    collection = database.collection ('users');
    console.log ('Connected to `' + dbName + '`!');
  });
});
