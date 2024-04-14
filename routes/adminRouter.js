const {Router} = require('express')
const controller = require('../controller/adminController')
const adminRouter = Router()
const multer = require('multer')
const fs = require('fs')

//adminRouter.get('/prepareMockForBooks',controller.prepareMockForBooks)
//adminRouter.get('/prepareMockForBookStores',controller.prepareMockForBookStores)
//adminRouter.get('/prepareMockForBookStoresBooks',controller.prepareMockForBookStoresBooks)








module.exports = adminRouter