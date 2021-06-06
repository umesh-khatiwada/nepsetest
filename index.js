const express = require('express');
const app = express();
var path = require('path');
const router = require("./config/router");
const PORT = process.env.PORT || 3000;
app.use(express.urlencoded({ extended: true })); 

const mongoURI = require("./config/mangooKey");
const mongoose = require("mongoose");
const nepsedata = require("./model/nepsedata.js");
var mcache =require('memory-cache');

const fileUpload = require('express-fileupload');
app.use(fileUpload());
// app.use(api);

app.use(express.json());
mongoose.connect(mongoURI, { useUnifiedTopology: true, useNewUrlParser: true }, (err) => console.log(err));


app.engine('.html', require('ejs').__express);
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");



app.use(express.static(path.join(__dirname, 'static')));
app.use(express.static(path.join(__dirname, 'config/uploads')));



app.use(router);

app.listen(PORT, ()=> console.log(PORT));