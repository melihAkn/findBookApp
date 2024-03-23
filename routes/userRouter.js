const {Router} = require('express')
const controller = require('../controller/userController')
const tokenAuth = require('../middleware/tokenAuthForRoutes')
const userRouter = Router()
userRouter.use(tokenAuth)
//page renders

//get request
userRouter.get('/userOrBookStoresGetCardDetails',controller.userOrBookStoresGetCardDetails)


//post requests
userRouter.post('/userAndBookStoresAddToCart',controller.userAndBookStoresAddToCart)
userRouter.post('/userAndBookStoresCompleteOrder',controller.userAndBookStoresCopmleteOrder)

















module.exports = userRouter