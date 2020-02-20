const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(morgan('combined'));
app.use(bodyParser.json({ extended: true }));

const port = process.env.PORT || 8080;

app.get('/',(req,res)=>{
    res.send("Hi There..!")
})

app.listen(port,()=>{
    console.log("Server is listening on port ", port)
});