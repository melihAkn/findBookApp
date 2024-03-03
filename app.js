//necessary packages
const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const expHbs = require('express-handlebars');
require('dotenv').config();
//middlewares
const layoutSetForAllRoutes = require('./middleware/ifTokenValidSetLyout')

//router files
const indexRouter = require('./routes/indexRouter')
const userRouter = require('./routes/userRouter')
const bookStoreRouter = require('./routes/bookStoreRouter')
//app config
const findBookInMyCity = express();
findBookInMyCity.use(express.static('public'));
findBookInMyCity.use(express.urlencoded({extended:true}));
findBookInMyCity.use(express.json());
findBookInMyCity.use(cookieParser());
findBookInMyCity.use(layoutSetForAllRoutes)
//set router
findBookInMyCity.use('/',indexRouter);
findBookInMyCity.use('/user',userRouter)
findBookInMyCity.use('/bookStores',bookStoreRouter)
//template engine
findBookInMyCity.engine('handlebars', expHbs.engine());
findBookInMyCity.set('view engine', 'handlebars');
findBookInMyCity.set('views', './views');
findBookInMyCity.set('view options', { layout: 'main' });


const port = 3000;

//database connect
const connectionString = process.env.CONNECTION_STRING;

  mongoose.connect(connectionString).then(console.log('connection is success')).catch(e => console.log(e));
  
  
  
  findBookInMyCity.listen(port , _ => {
    console.log(`server running on ${port}`);
});