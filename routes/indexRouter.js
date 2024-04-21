const {Router} = require('express')
const controller = require('../controller/indexController')
const tokenAuth = require('../middleware/tokenAuthForRoutes')
const errorHandler = require('../middleware/errorHandler')
const indexRouter = Router()

//page renders
indexRouter.get('/',controller.mainPage)
indexRouter.get('/books',controller.booksPage)
indexRouter.get('/bookStores',controller.bookStoresPage)
indexRouter.get('/contact',controller.contactPageRender)
indexRouter.get('/login',controller.loginPage)
indexRouter.get('/register',controller.registerPage)
indexRouter.get('/shoppingCard',controller.shoppingCardPageRender)
//get requests
indexRouter.get('/logout',controller.logout,)

//post requests
//contact form
indexRouter.post('/contact',controller.contactPost)
//users and bookstores login
indexRouter.post('/userLogin',controller.userLogin,errorHandler)
indexRouter.post('/userRegister',controller.userRegister)
indexRouter.post('/bookStoresLogin',controller.bookStoresLogin,errorHandler)
// users and bookstores register

indexRouter.post('/bookStoreRegister',controller.bookStoreRegister)
//searching books by city and name in req.body
indexRouter.post('/performSearch',controller.performSearch,errorHandler)
//get comments for books
indexRouter.post('/getComments',controller.getComments)






module.exports = indexRouter