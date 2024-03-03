const {Router} = require('express');
const controller = require('../controller/userController');
const userRouter = Router();

//page renders
userRouter.get('/',controller.get)



















module.exports = userRouter;