//necessary packages
const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const expHbs = require('express-handlebars');


require('dotenv').config();
//router files
const indexRouter = require('./routes/indexRouter')
//controller
const findBookInMyCity = express();
findBookInMyCity.use(express.static('public'));
findBookInMyCity.use(express.urlencoded({extended:true}));
findBookInMyCity.use(express.json());
findBookInMyCity.use(cookieParser());

//template engine
findBookInMyCity.engine('handlebars', expHbs.engine());
findBookInMyCity.set('view engine', 'handlebars');
findBookInMyCity.set('views', './views');

findBookInMyCity.set('view options', { layout: 'main' });
//routers
findBookInMyCity.use('/',indexRouter);
const port = 3000;

//database connect
const connectionString = process.env.CONNECTION_STRING;

  mongoose.connect(connectionString).then(console.log('connection is success')).catch(e => console.log(e));
  
  
  
  findBookInMyCity.listen(port , _ => {
    console.log(`server running on ${port}`);
});