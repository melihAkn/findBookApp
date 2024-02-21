const {Router} = require('express');
const controller = require('../controller/indexController');
const indexRouter = Router();
//const tokenAuthForRoutes = require('../middleware/tokenAuthForRoutes')
//page renders
indexRouter.get('/',controller.mainPage);
indexRouter.get('/books',controller.booksPage)



module.exports = indexRouter;