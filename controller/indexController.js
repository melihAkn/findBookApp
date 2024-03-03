const contactModel = require('../model/contacts')
const booksModel = require('../model/books')
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
    console.log("layout")
    console.log(req.layout)
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
                if(data == true){
                    
                    const userToken = sign(findUser.id,userSecretKey)
                    console.log(userToken)
                    res.cookie('userToken',userToken,{maxAge : 3600000,httpOnly: true, path: '/',secure : false});
                    res.status(200).send({message : "successfull login",loginAttemp : true})
                }else{
                    res.status(401).send({message : "username or password wrong",loginAttemp : false})
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
                    const bookStoreToken = sign(findBookStores.id,userSecretKey)
                    res.cookie('bookStoresToken',bookStoreToken,{maxAge : 3600000,httpOnly: true, path: '/',secure : false});
                    res.status(200).send({message : "successfull login",loginAttemp : true})

                }else{
                    res.status(401).send({message : "username or password wrong",loginAttemp : false})
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
    bookStoreRegister,
    logout
}