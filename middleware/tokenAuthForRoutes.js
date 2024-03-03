const {verify} = require('jsonwebtoken');
require('dotenv').config();
const jwtSecretKey = process.env.JWT_USER_SECRET_KEY;
let token
let tokenIsValid
const jwtControl =(req,res,next) => {
    if(req.cookies.userToken){
        token = req.cookies.userToken
        tokenIsValid = verify(token,jwtSecretKey)
    }else if(req.cookies.bookStoresToken){
        token = req.cookies.bookStoresToken
        tokenIsValid = verify(token,jwtSecretKey)
    }else{
        return res.redirect('/login');
    }
   req.userId = tokenIsValid
    
    if (!tokenIsValid) {
        return res.redirect('/login');
    }
    next()
}
module.exports = jwtControl