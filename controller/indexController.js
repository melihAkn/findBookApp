const contactModel = require('../model/contacts')
const {bookModel} = require('../model/books')
const {bookStoresBookModel,bookStoresModel} = require('../model/bookStores')
const {usersModel} = require('../model/users')
const {compare,hash} = require('bcrypt')
const {sign,verify} = require('jsonwebtoken')
const userSecretKey = process.env.JWT_USER_SECRET_KEY;
const bookStoresSecretKey = process.env.JWT_BOOKSTORES_SECRET_KEY;
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



const fullBookDetails = (req,res) => {
    res.render('./pages/indexPages/detailedBooksPage')

}


const contactPost = async (req,res) => {
    try {
        const contactInfo = new contactModel(req.body)
        await contactInfo.save()
        res.status(200).send({message :'message was sent successfully.'})  
    } catch (error) {
        res.status(500).send(error)
    }

}

const userLogin = async (req,res) => {
    try {
        console.log("user login")
        const findUser = await usersModel.findOne({username : req.body.username})
        if(!findUser){
            res.status(401).send({message : "username or password wrong",loginAttemp : false})
        }else{

        
        compare(req.body.password,findUser.password)
              .then(async data => {
                if(data == true){
                    
                    const userToken = sign(findUser.id,userSecretKey)
                    console.log(userToken)
                    res.cookie('userToken',userToken,{maxAge : 3600000,httpOnly: true, path: '/',secure : false});
                    res.status(200).send({message : "successfull login",loginAttemp : true})
                }else{
                    res.status(401).send({message : "username or password wrong",loginAttemp : false})
                }
    
    
              })
            }
    } catch (error) {
        res.status(500).send({error})
    }

}

const bookStoresLogin = async (req,res) => {
    try {
        const findBookStores = await bookStoresModel.findOne({username : req.body.username})
        if(!findBookStores){
            res.status(401).send({message : "username or password wrong",loginAttemp : false})
        }else{

        compare(req.body.password,findBookStores.password)
              .then(async data => {
                if(data == true){
                    const bookStoreToken = sign(findBookStores.id,userSecretKey)
                    res.cookie('bookStoresToken',bookStoreToken,{maxAge : 3600000,httpOnly: true, path: '/',secure : false});
                    res.status(200).send({message : "successfull login",loginAttemp : true})
                }else{
                    res.status(401).send({message : "username or password wrong",loginAttemp : false}) 
                }
              })
            }
    } catch (error) {
        res.status(500).send({error})
    }

}
const userRegister = async (req,res) => {
    console.log(req.body)
    const password = req.body.password
          hash(password, 10).then(async function(hash) {
            console.log(hash);
            const userRegisterInfos = {
                nameAndSurname : req.body.name + " " + req.body.surname,
                username : req.body.username,
                email : req.body.email,
                password : hash,
                city : req.body.city,
                phoneNumber : req.body.phoneNumber
            }
            const user = new usersModel(userRegisterInfos);
            await user.save();
            if(user.createdAt){
                res.status(200).send({message : "you are registered redirecting to login page",registered : true})
            }
        })
        .catch(e => {
            res.status(500).send({error : e,registered : false})
        })
}

const bookStoreRegister = async (req,res) => {
    console.log(req.body)
    const password = req.body.password
          hash(password, 10).then(async function(hash) {
            console.log(hash);
            const bookStoresRegisterInfos = {
                name : req.body.name,
                username : req.body.username,
                email : req.body.email,
                password : hash,
                phoneNumber : req.body.phoneNumber,
                city : req.body.city,
                physcialAddress : req.body.physcialAddress
            }
            const bookStores = new bookStoresModel(bookStoresRegisterInfos);
            await bookStores.save();
            if(bookStores.createdAt){
                res.status(200).send({message : "you are registered redirecting to login page",registered : true})
            }
        })
        .catch(e => {
            res.status(500).send({error : e,registered : false})
        })
}
const logout = async (req,res) => {
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
        console.log(error);
    }
}

const performSearch = async (req,res) => {
    //Based on the given book name,
    //the stationery store that owns that book according to the given city should be found,
    //and information about that book and the stationery store related to that book should be sent.
    // console.log(req.body)
    try {
        let books = []
    // using a regular expression created from the 'bookName' value in the request body.
    // If 'bookName' is not empty, a case-insensitive regular expression is created to match 'bookName' value.
    // If 'bookName' is empty, the regular expression '/./' is used to match any character.
    
    const bookNameRegex = req.body.bookName.length > 0 ? new RegExp(req.body.bookName, 'i') : /./
    const findAllBooks = await bookModel.find({ name: bookNameRegex })
    
    const findBookStoresInSearchedCity = await bookStoresModel.find({ city: req.body.searchedCity })
    
    for (const bookStore of findBookStoresInSearchedCity) {
        const bookStoresBooks = await bookStoresBookModel.find({ bookStoreId: bookStore._id })
    
        for (const bookStoresBook of bookStoresBooks) {
            const foundBook = findAllBooks.find(book => book._id.toString() === bookStoresBook.bookId.toString())
    
            if (foundBook) {
                const existingBookIndex = books.findIndex(book => book._id.toString() === foundBook._id.toString())
                if (existingBookIndex !== -1) {
                    books[existingBookIndex].bookStoreInfos.push({
                        bookStoreId: bookStore._id,
                        bookStoreName : bookStore.name,
                        stockInfo: bookStoresBook.stockInfo,
                        price: bookStoresBook.price
                    })
                } else {
                    books.push({
                        _id: foundBook._id,
                        name: foundBook.name,
                        description: foundBook.description,
                        pageCount: foundBook.pageCount,
                        category: foundBook.category,
                        averageRating: foundBook.averageRating,
                        publicationDate: foundBook.publicationDate,
                        author: foundBook.author,
                        ISBN: foundBook.ISBN,
                        images: foundBook.images,
                        isValidBook: foundBook.isValidBook,
                        bookStoreInfos: [{
                            bookStoreId: bookStore._id,
                            bookStoreName : bookStore.name,
                            stockInfo: bookStoresBook.stockInfo,
                            price: bookStoresBook.price
                        }]
                    })
                }
            }
        }
    }
    if(books.length == 0){
        books = findAllBooks
        res.status(200).send({books,message : "There are no bookstores selling the searched book or books in the city. you can add to wishlist searched books ",bookFound : false})
        console.log("kitap bulunamadi")
    }else{
        res.status(200).send({books ,bookFound : true})
    }
    
    } catch (error) {
        console.error(error)
        res.status(500).send({message : "databese error",error})
    }

    
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
    bookStoresLogin,
    userRegister,
    bookStoreRegister,
    logout,
    performSearch,
    fullBookDetails,
}