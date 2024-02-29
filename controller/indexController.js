const contactModel = require('../model/contacts')
const booksModel = require('../model/books')
const bookStoresModel = require('../model/bookStores')
const usersModel = require('../model/users')


const mainPage = (req,res) => {

    res.render('./pages/indexPages/mainPage')
}
const booksPage = (req,res) => {

    res.render('./pages/indexPages/booksPage')

}

const bookStoresPage = (req,res) => {
    
    res.render('./pages/indexPages/bookStoresPage')
}

const loginPage = (req,res) => {

    res.render('./pages/indexPages/loginPage')

}

const registerPage = (req,res) => {

    res.render('./pages/indexPages/registerPage')


}

const contactPageRender = (req,res) => {
    res.render('./pages/indexPages/contactPage')
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
    console.log("user login")
    console.log(req.body)
    res.send()
}

const bookStoresLogin = async (req,res) => {
    console.log("bookStores login")
    console.log(req.body)
    res.send()

}
module.exports = {
    mainPage,
    booksPage,
    bookStoresPage,
    contactPageRender,
    contactPost,
    loginPage,
    registerPage,
    userLogin,
    bookStoresLogin
}