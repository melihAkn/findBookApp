const {bookStoresBookModel,bookStoresModel} = require('../model/bookStores')
const {bookModel} = require('../model/books')
const {compare,hash} = require('bcrypt')
const fs = require('fs')

const profilePage = (req,res) => {

    res.render('./pages/bookStorePages/bookStoreProfilePage',{layout : req.layout})

}

const getUserInfos = async (req,res) => {
    try {
        const getBookStoreInfos = await bookStoresModel.findOne({_id : req.userId}).select("-_id -password -createdAt -updatedAt -__v")
        const getBookStoresBooks = await bookStoresBookModel.findOne({_id : req.userId}).select("-createdAt -updatedAt -__v")
        res.status(200).send({getBookStoreInfos,getBookStoresBooks})
    } catch (error) {
        res.status(500).send({error})
    }
}


const updateInfos = async (req,res) => {
    const userId = req.userId
    console.log(userId)
    try {
        const findUser = await bookStoresModel.findById(userId)
        console.log(findUser)
        const compareUserPassword = await compare(req.body.password , findUser.password)
        if(compareUserPassword){
            //update
            if(req.body.newPassword){
                req.body.password = req.body.newPassword
                await hash(req.body.password, 10).then(async function(hash) {
                    console.log(hash);
                    req.body.password = hash;
                });
                const updateData = {
                    name : req.body.name,
                    username : req.body.username,
                    password : req.body.password,
                    email : req.body.email,
                    phoneNumber : req.body.phoneNumber,
                    physcialAddress : req.body.physcialAddress
                }
                //update here
                const updateUserInfos = await bookStoresModel.updateOne({_id : userId},updateData)
            }else{
                //direct update
                const updateData = {
                    name : req.body.name,
                    username : req.body.username,
                    email : req.body.email,
                    phoneNumber : req.body.phoneNumber,
                    physcialAddress : req.body.physcialAddress
                }
                //update here
                const updateUserInfos = await bookStoresModel.updateOne({_id : userId},updateData)
            }
            res.status(200).send({message : "infos updated successfully", updated : true})
        }
        else{
            res.status(400).send({message : "wrong password" , updated : compareUserPassword})
        }
        

    } catch (error) {
        console.log(error)
        res.status(500).send({error})
    }
}

const addBook = async (req,res) => {
    console.log(req.body)
    const bookIsAddedToDatabase = await bookModel.find({ISBN : req.body.bookISBN})
    if(bookIsAddedToDatabase.length > 0){
        try {
            const bookStoresBookData = {
                bookStoreId : req.userId,
                bookId : bookIsAddedToDatabase[0]._id,
                stockInfo : req.body.stockInfo,
                price : req.body.price
            }
        
            const addBookToBookStoresBook = new bookStoresBookModel(bookStoresBookData)
            await addBookToBookStoresBook.save() 
            res.status(200).send({message : "book addes successfully", error : false})
        } catch (error) {
            console.error(error)
            if(error.code == 11000){
                //11000 error code is duplicate key in mongodb
                //409 conflict
                res.status(409).send({message : "This book already exists among your added books" , error : true})
            }
            res.status(500).send({error})
        }
       
    }else{

        try {

            let bookImageNumber = 1
            let imagePaths = []
            const bookNameArray = req.body.bookName.split(' ')
            const bookNameArrayButUnderscore = []
            /*
            bookname cant contains spaces so replace them to underscore => _
            because its hard to search
            */
            for (let i = 0; i < bookNameArray.length; i++) {
                if(i == bookNameArray.length - 1){
                    bookNameArrayButUnderscore.push(bookNameArray[i]) 
                }else{
                    bookNameArrayButUnderscore.push(bookNameArray[i])
                    bookNameArrayButUnderscore.push('_')
                }
            }
            let bookImagesPath = ""
            for (let k = 0; k < bookNameArrayButUnderscore.length; k++) {
                bookImagesPath += bookNameArrayButUnderscore[k]
            }
            //change the file directory and name uploaded by user
            req.files.forEach(e => {
                const imageDIR = `public/uploads/${bookImagesPath}`
                const bookImagePath = `public/uploads/${bookImagesPath}/${bookImageNumber}.${e.mimetype.split('/')[1]}`
                fs.mkdir(imageDIR, { recursive: true }, function(err) {
                    if (err) {
                      console.error('Error creating directory:', err);
                    }
                })
                fs.rename(e.path,bookImagePath,(err) => {
                    if (err) {
                        console.error('file move error:', err);
                        return;
                      }
                })
                imagePaths.push({imageNumber : bookImageNumber , imagePath : bookImagePath})
            bookImageNumber++
            });
            
            const bookData = {
                name : req.body.bookName,
                description : req.body.bookDescription,
                pageCount : req.body.bookPageCount,
                category : req.body.category,
                averageRating : req.body.bookAverageRating,
                publicationDate : req.body.bookPublicationDate,
                author : req.body.bookAuthor,
                ISBN : req.body.bookISBN,
                isValidBook : false,
                images : []
            }
           
            imagePaths.forEach(e => {
        
                bookData.images.push({index : e.imageNumber , path : e.imagePath})
        
            })
            //database insert
            const addBookToDatabase = new bookModel(bookData)
            await addBookToDatabase.save()
        
        
            const bookStoresBookData = {
                bookStoreId : req.userId,
                bookId : addBookToDatabase._id,
                stockInfo : req.body.stockInfo,
                price : req.body.price
            }
        
            const addBookToBookStoresBook = new bookStoresBookModel(bookStoresBookData)
            await addBookToBookStoresBook.save()
            
            
        } catch (error) {
            console.error(error)
            res.status(500).send({error})
        }
    }
}


module.exports = {
    profilePage,
    updateInfos,
    getUserInfos,
    addBook
}