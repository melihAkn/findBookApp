const {Router} = require('express');
const controller = require('../controller/indexController');
const indexRouter = Router();
//const tokenAuthForRoutes = require('../middleware/tokenAuthForRoutes')

//page renders
indexRouter.get('/',controller.mainPage);
indexRouter.get('/books',controller.booksPage)
indexRouter.get('/bookStores',controller.bookStoresPage)
indexRouter.get('/contact',controller.contactPageRender)
indexRouter.get('/login',controller.loginPage)
indexRouter.get('/register',controller.registerPage)

//get requests
indexRouter.get('/logout',controller.logout)


//post requests
//contact form
indexRouter.post('/contact',controller.contactPost)
//users and bookstores login
indexRouter.post('/userLogin',controller.userLogin)
indexRouter.post('/bookStoresLogin',controller.bookStoresLogin)
// users and bookstores register
indexRouter.post('/userRegister',controller.userRegister)
indexRouter.post('/bookStoreRegister',controller.bookStoreRegister)
//searching books by city and name in req.body
indexRouter.post('/performSearch',controller.performSearch)







module.exports = indexRouter;