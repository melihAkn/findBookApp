const contactModel = require('../model/contacts')
const { createUser, loginUser, loginBookStore, createBookStore } = require('../services/userService')
const { searchedBookInfos , getBookComments , getCountBooks } = require('../services/ProductService')
//page renders
const mainPage = (req,res) => {
    res.render('./pages/indexPages/mainPage',{layout : req.layout})
}
const booksPage = (req,res) => {
    res.render('./pages/indexPages/booksPage',{layout : req.layout})
}

const bookStoresPage = (req,res) => {
    res.render('./pages/indexPages/bookStoresPage',{layout : req.layout})
}

const loginPage = (req,res) => {
    res.render('./pages/indexPages/loginPage',{layout : req.layout})
}
const registerPage = (req,res) => {
    res.render('./pages/indexPages/registerPage',{layout : req.layout})
}

const contactPageRender = (req,res) => {
    res.render('./pages/indexPages/contactPage',{layout : req.layout})
}

const shoppingCardPageRender = (req,res) => {
    res.render('./pages/indexPages/shoppingCard',{layout : req.layout})
}
//functions

const contactPost = async (req,res,next) => {
    try {
        const contactInfo = new contactModel(req.body)
        await contactInfo.save()
        res.status(200).send({message :'message was sent successfully.'})  
    } catch (error) {
        res.status(500).send(error)
    }

}

const userLogin = async (req,res,next) => {
    console.log(req.body)
    if(req.body.username == undefined || req.body.password == undefined){
        const err = new Error("username or password not provided")
        err.code = 400
        return next(err)
    }
    
    const userIsLoginned = await loginUser(req.body)
    console.log(userIsLoginned)
    if(!userIsLoginned.loginAttemp){
        res.status(401).send({message :"username or password wrong"})
    }else{
        res.cookie('userToken',userIsLoginned.cookie,{maxAge : 3600000,httpOnly: true, path: '/',secure : false})
        res.status(200).send({message : "you are loginned redirected in 2 seconds" , loginAttemp : true})
    }
}

const userRegister = async (req,res,next) => {
    const registeredUser = await createUser(req.body)
    if(registeredUser.userCreated){
        res.status(200).send({message : "you are registered redirecting to login page", registered : true})
    }else{
        res.status(401).send({message : registeredUser.returnedUser.message , registered : false})
    }
}


const bookStoresLogin = async (req,res,next) => {
    console.log(req.body)
    if(req.body.username == undefined || req.body.password == undefined){
        const err = new Error("username or password not provided")
        err.code = 400
        return next(err)
    }
    const userIsLoginned = await loginBookStore(req.body)
    if(!userIsLoginned.loginAttemp){
        res.status(401).send({message :"username or password wrong"})
    }else{
        res.cookie('bookStoresToken',userIsLoginned.cookie,{maxAge : 3600000,httpOnly: true, path: '/',secure : false})
        res.status(200).send({message : "you are loginned redirected in 2 seconds" , loginAttemp : true})
    }
}


const bookStoreRegister = async (req,res,next) => {
    const registeredBookstore = await createBookStore(req.body)
    if(registeredBookstore.userCreated){
        res.status(200).send({message : "you are registered redirecting to login page", registered : true})
    }else{
        res.status(401).send({message : registeredBookstore.returnedUser.message , registered : false})
    }
}
const logout = async (req,res,next) => {
    try {
        if(req.cookies.bookStoresToken){
            res.clearCookie('bookStoresToken',{path : '/'})
            res.status(200).send({message : "token deleted" , tokenDeleted : true})
        }else if(req.cookies.userToken){
            res.clearCookie('userToken',{path : '/'});
            res.status(200).send({message : "token deleted" , tokenDeleted : true})
        }else if(req.cookies.bookStoresToken && req.cookies.userToken){
            res.clearCookie('bookStoresToken',{path : '/'})
            res.clearCookie('userToken',{path : '/'})
            res.status(200).send({message : "token deleted" , tokenDeleted : true})
        }else{
            res.status(400).send({message : "there is no token",tokenDeleted : false })
        }
    
    } catch (error) {
        console.error(error);
    }
}

const performSearch = async (req,res,next) => {
    // getting all books in given city and name and find selling bookstore every book then send to the client side
    //Based on the given book name,
    //the stationery store that owns that book according to the given city should be found,
    //and information about that book and the stationery store related to that book should be sent.
        
    // using a regular expression created from the 'bookName' value in the request body.
    // If 'bookName' is not empty, a case-insensitive regular expression is created to match 'bookName' value.
    // If 'bookName' is empty, the regular expression '/./' is used to match any character.

    if(req.body.bookName == null || req.body.bookName == undefined || req.body.searchedCity == null || req.body.searchedCity == undefined || req.body.searchedCity == ""){
        const err = new Error("bookname or searched city not provided")
        err.code = 400
        return next(err)
    }
    const bookNameRegex = req.body.bookName.length > 0 ? new RegExp(req.body.bookName, 'i') : /./
    const searchForBooks =  await searchedBookInfos({name : bookNameRegex , city : req.body.searchedCity ,skip : req.body.skip,limit : req.body.limit})
    res.status(200).send(searchForBooks)
    
}

const getComments = async (req,res,next) => {
    const bookComments = await getBookComments({bookId : req.body.bookId})
    res.status(200).send(bookComments)
}

const getBooksCount = async (req,res,next) => {
    const getBc = await getCountBooks()
    res.status(200).send({bookC : getBc})
}
module.exports = {
    //page renders
    mainPage,
    booksPage,
    bookStoresPage,
    contactPageRender,
    shoppingCardPageRender,
    //post get or other things
    contactPost,
    loginPage,
    registerPage,
    userLogin,
    userRegister,
    bookStoresLogin,
    bookStoreRegister,
    logout,
    performSearch,
    getComments,
    getBooksCount
}