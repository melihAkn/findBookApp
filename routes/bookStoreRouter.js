const {Router} = require('express');
const controller = require('../controller/bookStoreController')
const tokenAuth = require('../middleware/tokenAuthForRoutes')
const bookStoreRouter = Router();
bookStoreRouter.use(tokenAuth)
//page renders
bookStoreRouter.get('/profile',controller.profilePage)

//get requests
bookStoreRouter.get('/getUserInfos',controller.getUserInfos)

//post requests
bookStoreRouter.post('/updateInfos',controller.updateInfos)



















module.exports = bookStoreRouter;