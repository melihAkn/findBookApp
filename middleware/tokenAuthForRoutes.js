const {verify} = require('jsonwebtoken');
require('dotenv').config();
const jwtSecretKey = process.env.JWT_USER_SECRET_KEY;
let token
let tokenIsValid
let ownerOfToken
const jwtControl =(req,res,next) => {
    if(req.cookies.userToken){
        token = req.cookies.userToken
        tokenIsValid = verify(token,jwtSecretKey)
        ownerOfToken = "user"
    }else if(req.cookies.bookStoresToken){
        token = req.cookies.bookStoresToken
        tokenIsValid = verify(token,jwtSecretKey)
        ownerOfToken = "bookStore"
    }else{
        return res.redirect('/login');
    }
   req.userId = {tokenIsValid,ownerOfToken}
    
    if (!tokenIsValid) {
        return res.redirect('/login');
    }
    next()
}
module.exports = jwtControl