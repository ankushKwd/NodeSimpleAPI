const express = require ('express');
const bodyParser = require ('body-parser');
const morgan = require ('morgan');
const MongoClient = require ('mongodb').MongoClient;
const cors = require ('cors');
const app = express ();
app.use (cors ());
app.use (morgan ('combined'));
app.use (bodyParser.json ());
app.use (bodyParser.urlencoded ({extended: false}));
const url = 'mongodb://localhost:27017/Test';
const dbName = 'Test';
const port = process.env.PORT || 8080;

const userRouter = require ('./userRouter');
app.use ('/api', userRouter);

MongoClient.connect (url, {useUnifiedTopology: true}, (err, db) => {
  var dbase = db.db (dbName);
  app.locals.db = dbase;
  if (err) return console.log (err);
  app.listen (port, () => {
    console.log ('app working on ', port);
  });
});
