const {Router} = require('express')
const controller = require('../controller/userController')
const tokenAuth = require('../middleware/tokenAuthForRoutes')
const userRouter = Router()
userRouter.use(tokenAuth)
//page renders
userRouter.get('/',controller.get)
//post requests
userRouter.post('/userAndBookStoresAddToCart',controller.userAndBookStoresAddToCart)


















module.exports = userRouter