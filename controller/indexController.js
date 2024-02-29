const contactModel = require('../model/contacts')
const booksModel = require('../model/books')
const bookStoresModel = require('../model/bookStores')
const usersModel = require('../model/users')
const {compare,hash} = require('bcrypt')
const {sign,verify} = require('jsonwebtoken')
const userSecretKey = process.env.JWT_USER_SECRET_KEY;
const bookStoresSecretKey = process.env.JWT_BOOKSTORES_SECRET_KEY;
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
    try {
        console.log("user login")
        console.log(req.body)
        const findUser = await usersModel.findOne({username : req.body.username})
        compare(req.body.password,findUser.password)
              .then(async data => {
                console.log(data)
                if(data == true){
                    
                    const token = sign(findUser.id,userSecretKey)
                    res.cookie('userToken',userToken,{maxAge : 3600000,httpOnly: true, path: '/',secure : false});
                }else{
                    res.status(401).send({message : "username or password wrong"})
                }
    
    
              })
    } catch (error) {
        res.status(500).send({error})
    }

}

const bookStoresLogin = async (req,res) => {
    try {
        console.log("user login")
        console.log(req.body)
        const findBookStores = await bookStoresModel.findOne({username : req.body.username})
        compare(req.body.password,findBookStores.password)
              .then(async data => {
                console.log(data)
                if(data == true){
                    const token = sign(findBookStores.id,userSecretKey)
                    res.cookie('bookStoresToken',userToken,{maxAge : 3600000,httpOnly: true, path: '/',secure : false});
                }else{
                    res.status(401).send({message : "username or password wrong"})
                }
    
    
              })
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
module.exports = {
    mainPage,
    booksPage,
    bookStoresPage,
    contactPageRender,
    contactPost,
    loginPage,
    registerPage,
    userLogin,
    bookStoresLogin,
    userRegister,
    bookStoreRegister
}