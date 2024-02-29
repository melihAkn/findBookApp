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

//post
indexRouter.post('/contact',controller.contactPost)
indexRouter.post('/userLogin',controller.userLogin)
indexRouter.post('/bookStoresLogin',controller.bookStoresLogin)
module.exports = indexRouter;