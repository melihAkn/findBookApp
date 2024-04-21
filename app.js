//necessary packages
const express = require('express')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const expHbs = require('express-handlebars')
require('dotenv').config()
const { createClient } = require('redis');
/*
(async () => {
  const client = createClient()

  client.on('error', (err) => console.log('Redis Client Error', err))

  await client.connect()

  await client.set('key', 'value')
  const value = await client.get('key')
})()
*/
//middlewares
const layoutSetForAllRoutes = require('./middleware/ifTokenValidSetLyout')

//router files
const indexRouter = require('./routes/indexRouter')
const userRouter = require('./routes/userRouter')
const bookStoreRouter = require('./routes/bookStoreRouter')
const adminRouter = require('./routes/adminRouter')
//app config
const findBookInMyCity = express()
findBookInMyCity.use(express.static('public'))
findBookInMyCity.use(express.urlencoded({extended:true}))
findBookInMyCity.use(express.json())
findBookInMyCity.use(cookieParser())
findBookInMyCity.use(layoutSetForAllRoutes)
//set router
findBookInMyCity.use('/',indexRouter)
findBookInMyCity.use('/user',userRouter)
findBookInMyCity.use('/bookStores',bookStoreRouter)
findBookInMyCity.use('/admin',adminRouter)
//template engine
findBookInMyCity.engine('handlebars', expHbs.engine())
findBookInMyCity.set('view engine', 'handlebars')
findBookInMyCity.set('views', './views')
findBookInMyCity.set('view options', { layout: 'main' })




//database connect
const connectionString = process.env.CONNECTION_STRING

mongoose.connect(connectionString).then(console.log('connection is success')).catch(e => console.log(e))
  
const port = 3000
  findBookInMyCity.listen(port , _ => {
    console.log(`server running on ${port}`)
})

module.exports = findBookInMyCity