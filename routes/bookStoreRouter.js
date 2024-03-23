const {Router} = require('express')
const controller = require('../controller/bookStoreController')
const tokenAuth = require('../middleware/tokenAuthForRoutes')
const validBookStores = require('../middleware/tokenOwnerIsBookstore')
const bookStoreRouter = Router()
bookStoreRouter.use(tokenAuth)
bookStoreRouter.use(validBookStores)
const multer = require('multer')
const fs = require('fs');
//multer set
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      
        if (!fs.existsSync('public/uploads')) {
            fs.mkdirSync('public/uploads');
          }
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname)
    }
    
  });
  const upload = multer({ storage: storage });
//page renders
bookStoreRouter.get('/profile',controller.profilePage)

//get requests
bookStoreRouter.get('/getUserInfos',controller.getUserInfos)

//post requests
bookStoreRouter.post('/updateInfos',controller.updateInfos)
bookStoreRouter.post('/addBook',upload.array('images',10),controller.addBook)
bookStoreRouter.post('/addToCard',controller.addToCart)

















module.exports = bookStoreRouter;