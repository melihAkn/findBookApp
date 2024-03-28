const {Router} = require('express')
const controller = require('../controller/userController')
const tokenAuth = require('../middleware/tokenAuthForRoutes')
const userRouter = Router()
userRouter.use(tokenAuth)
//page renders

//get request
userRouter.get('/userOrBookStoresGetCardDetails',controller.userOrBookStoresGetCardDetails)
userRouter.get('/profile',controller.userProfilePageRender)
userRouter.get('/getUserInfos',controller.getUserInfos)
userRouter.get('/getUserOrders',controller.getUserOrders)
//post requests
userRouter.post('/UpdateInfos',controller.updateInfos)
userRouter.post('/userAndBookStoresAddToCart',controller.userAndBookStoresAddToCart)
userRouter.post('/userAndBookStoresCompleteOrder',controller.userAndBookStoresCopmleteOrder)
userRouter.post('/userOrBookStoresDeleteItem',controller.userOrBookStoresDeleteItem)
















module.exports = userRouter