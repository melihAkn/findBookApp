const contactModel = require('../model/contacts')
const { createUser, loginUser, loginBookStore, createBookStore } = require('../services/userService')
const { searchedBookInfos , getBookComments , getCountBooks , mostSelledBooksByCity, mostPopularCategorys, MostSelledBooksInAllCity } = require('../services/ProductService')

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
    if(req.body.username == undefined || req.body.password == undefined){
        const err = new Error("username or password not provided")
        err.code = 400
        return next(err)
    }
    //validate username and password
    if(!/^[a-zA-Z0-9]{3,}$/.test(req.body.username) || req.body.password.length < 8) {
        return res.status(400).send({ error: 'Invalid username or password' })
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
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(req.body.email) || !/^[a-zA-Z0-9]{3,}$/.test(req.body.username) || !/^[a-zA-Z]{3,}$/.test(req.body.name) || !/^[a-zA-Z]{3,}$/.test(req.body.surname) || !/^\+?\d{10,14}$/.test(req.body.phoneNumber) || req.body.password.length < 8 ) {
        return res.status(400).json({ error: 'Invalid infos' })
      }

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
    if(!/^[a-zA-Z0-9]{3,}$/.test(req.body.username) || req.body.password.length < 8) {
        return res.status(400).send({ error: 'Invalid username or password' })
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
    console.log(req.body)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(req.body.email) || !/^[a-zA-Z0-9]{3,}$/.test(req.body.username) || !/^[a-zA-Z]{3,}$/.test(req.body.name) || !/^\+?\d{10,14}$/.test(req.body.phoneNumber) || req.body.password.length < 8 || !/^[a-zA-Z0-9\s]{3,}$/.test(req.body.physicalAddress) ) {
        return res.status(400).json({ error: 'Invalid infos' })
      }
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
    const searchForBooks =  await searchedBookInfos({name : bookNameRegex },{skip : req.body.skip,limit : req.body.limit, city : req.body.searchedCity })
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

const getMostSelledBooksByCity = async(req,res,next) => {

    const mostSelledBooksByC = await mostSelledBooksByCity({city : "Düzce"})
    const mostSelledBooksWithSellers = []
    console.log(mostSelledBooksByC[0])
    for(const item in mostSelledBooksByC){
        const getBookSellers = await searchedBookInfos({_id : mostSelledBooksByC[item].bookId},{city : "Düzce",skip : 0, limit : 5})
        for(book of getBookSellers.books){
            mostSelledBooksWithSellers.push(book)
        }
    }
    console.log(mostSelledBooksWithSellers)
    res.status(200).send({mostSelledBooksWithSellers})
}


const getBooksByMostPopularCategory = async(req,res,next) => {
    const mostPopularCategories = await mostPopularCategorys({city : "Düzce"})
    const mostPopularBooks = []
    for(const item of mostPopularCategories){
        const getBooksByCategory = await searchedBookInfos({category : item.bookCategory},{city : "Düzce",skip : 0, limit : 5})
        if(getBooksByCategory.bookFound){
            for(const book of getBooksByCategory.books){
                mostPopularBooks.push(book)
            }
        }
 }
    console.log(mostPopularBooks)
    res.status(200).send({books : mostPopularBooks})
}

const getNewlyAddedBooks = async(req,res,next) => {

    const lastMonthDate = new Date(new Date() - 7 * 24 * 60 * 60 * 1000)
    const newlyAddebBooks = await searchedBookInfos({ createdAt: { $gte: lastMonthDate } },{city : "Düzce",skip : 0, limit : 25})
    res.status(200).send({books : newlyAddebBooks.books})

}

const getPopularCategorys = async(req,res,next) => {
    const popularCategorys = await mostPopularCategorys({city : "Düzce"})
    console.log(popularCategorys)
    res.status(200).send({popularCategorys})
}
const getMostReliableBookStores = async(req,res,next) => {
//in bookstore ratings model bookstorerating field if greater than 4
// and order count higher than 100 or some number this is reliable bookstore in simple way of course

}

const getMonthOfBookStores = async(req,res,next) => {
// I dont kow how to i create this data
// i figured out
// every month we created a new collection in database
// and fill every order made by bookstores
// end of the month selecting 10 document this case (highest order count and ratings greater than 4)

}

const getPopularAndRisinBookStores = async(req,res,next) => {
// if new bookstore starting a sell book and first month order count greater than 50 or 100
// and rating greater than 4 or close this is popular and rising bookstore i think

}

const getAiSuggestedBooks = async(req,res,next) => {


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
    getBooksCount,
    getMostSelledBooksByCity,
    getBooksByMostPopularCategory,
    getNewlyAddedBooks,
    getPopularCategorys
}