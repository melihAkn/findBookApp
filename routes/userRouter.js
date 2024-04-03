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
userRouter.post('/buyLaterThisBook',controller.buyLaterThisBook)
userRouter.post('/userAndBookStoresWishList',controller.addToWishList)
userRouter.post('/userAndBookStoresAddToCart',controller.userAndBookStoresAddToCart)
userRouter.post('/userAndBookStoresAddFavorite',controller.userAndBookStoresAddToFavorite)
userRouter.post('/userAndBookStoresCompleteOrder',controller.userAndBookStoresCopmleteOrder)
userRouter.post('/userOrBookStoresUpdateOrDeleteItem',controller.userOrBookStoresUpdateOrDeleteItem)
















module.exports = userRouter