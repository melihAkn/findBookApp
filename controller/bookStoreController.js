const {bookStoresBookModel,bookStoresModel,bookStoreCartModel,bookStoreOrdersModel} = require('../model/bookStores')
const {usersModel} = require('../model/users')
const {bookModel , bookSellInfosModel} = require('../model/books')
const {compare,hash} = require('bcrypt')
const fs = require('fs')
const path = require('path')
const profilePage = (req,res) => {

    res.render('./pages/bookStorePages/bookStoreProfilePage',{layout : req.layout})

}

const getUserInfos = async (req,res) => {
    try {
        const getBookStoreInfos = await bookStoresModel.findOne({_id : req.userId.tokenIsValid}).select("-_id -password -createdAt -updatedAt -__v")
        const getBookStoresBooks = await bookStoresBookModel.findOne({_id : req.userId.tokenIsValid}).select("-createdAt -updatedAt -__v")
        res.status(200).send({getBookStoreInfos,getBookStoresBooks})
    } catch (error) {
        res.status(500).send({error})
    }
}


const updateInfos = async (req,res) => {
    const userId = req.userId.tokenIsValid
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
                    console.log(hash)
                    req.body.password = hash
                })
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
                bookStoreId : req.userId.tokenIsValid,
                bookId : bookIsAddedToDatabase[0]._id,
                stockInfo : req.body.stockInfo,
                price : req.body.price
            }
        
            const targetDirectory = path.join(__dirname, '..', 'uploads')

            fs.readdir(targetDirectory, (err, fileList) => {

                if (err) {
                    console.error('error:', err)
                    return
             }

            fileList.forEach((file) => {
            const filePath = path.join(targetDirectory, file)

            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error('error:', err)
                    return
            }

            console.log(`${file} deleted.`)
        })
    })
})
            const thisBookAlreadyAdded = await bookStoresBookModel.find({bookStoreId : req.userId.tokenIsValid , bookId : bookStoresBookData.bookId})
            console.log(thisBookAlreadyAdded)
            if(thisBookAlreadyAdded.length > 0){
                res.status(409).send({message : "this book already added to your book list"})
            }else{
                const addBookToBookStoresBook = new bookStoresBookModel(bookStoresBookData)
                await addBookToBookStoresBook.save()
                res.status(200).send({message : "book addes successfully", error : false})
            }
            
            
        } catch (error) {
            console.error(error)
            if(error.code == 11000){
                //11000 error code is duplicate key in mongodb
                //409 conflict
                res.status(409).send({message : "This book already exists among your added books" , error : true})
            }else{
                res.status(500).send({error})
            }
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
                const imageDIR = `public/uploads/bookImages/${bookImagesPath}`
                const bookImagePath = `public/uploads/bookImages/${bookImagesPath}/${bookImageNumber}.${e.mimetype.split('/')[1]}`
                console.log(imageDIR)
                fs.mkdir(imageDIR, { recursive: true }, function(err) {
                    if (err) {
                      console.error('Error creating directory:', err)
                    }
                })
                fs.rename(e.path,bookImagePath,(err) => {
                    if (err) {
                        console.error('file move error:', err)
                        return
                      }
                })
                imagePaths.push({imageNumber : bookImageNumber , imagePath : bookImagePath})
            bookImageNumber++
            })
            
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
                images : imagePaths.map(e => ({ path: e.imagePath, index: e.imageNumber }))
            }
           
            
            //database insert
            const addBookToDatabase = new bookModel(bookData)
            /*
            imagePaths.forEach(e => {
        
                addBookToDatabase.images.push({index : e.imageNumber , path : e.imagePath})
        
            })*/
            await addBookToDatabase.save()
        
        
            const bookStoresBookData = {
                bookStoreId : req.userId.tokenIsValid,
                bookId : addBookToDatabase._id,
                stockInfo : req.body.stockInfo,
                price : req.body.price
            }
        
            const addBookToBookStoresBook = new bookStoresBookModel(bookStoresBookData)
            await addBookToBookStoresBook.save()
            
            res.send({message : "book added successfully",error : false})
        } catch (error) {
            console.error(error)
            res.status(500).send({error})
        }
    }
}

const getOrders = async (req,res) => {
    try {
        
  
    const getOrders = await bookStoreOrdersModel.find({bookStoreId : req.userId.tokenIsValid})
    const bookStoreOrder = []
    for(let item in getOrders){
        bookStoreOrder.push({
            userInfos : {
                userFullName : getOrders[item].customerInfos.name,
                deliverAddress : getOrders[item].customerInfos.address,
                userPhoneNumber : getOrders[item].customerInfos.phoneNumber,
                userEmail : getOrders[item].customerInfos.email,
            },
            orderItems : [],
            orderDetails : {
                paymentMethod : getOrders[item].paymentMethod,
                totalAmount : getOrders[item].totalAmount,
                totalPrice : 0,
                orderStatus : getOrders[item].orderStatus,
                orderId : getOrders[item].id
            }
        })
        for(let book in getOrders[item].items){
            bookStoreOrder[item].orderItems.push({
                bookName : getOrders[item].items[book].bookName,
                quantity : getOrders[item].items[book].quantity,
                price : getOrders[item].items[book].price,
                bookISBN : getOrders[item].items[book].bookISBN
            })
        }
    }
    console.log(bookStoreOrder)
    res.status(200).send({bookStoreOrder})
} catch (error) {
    console.error(error)
        res.status(500).send({error})
}
}

const updateOrderStatus = async (req,res) => {

    try {
    console.log(req.body)
    const updateOrderStatus = await bookStoreOrdersModel.findByIdAndUpdate(req.body.orderId, {$set : {orderStatus : req.body.orderStatus}}, {
        new: true
      })
      if(req.body.orderStatus){
        //=== "Delivered to user"
        console.log("eist")
        console.log(req.body)
        console.log(updateOrderStatus)
        const bookStoreInfos = await bookStoresModel.findById(updateOrderStatus.bookStoreId)
        let findBook
        for(const book of updateOrderStatus.items){
            console.log(book)
            findBook = await bookModel.findOne({ISBN : book.bookISBN})
            console.log(findBook)
            const findThisMostSelledBook = await bookSellInfosModel.findOne({bookId : findBook._id , bookCity : bookStoreInfos.city})
            console.log(findThisMostSelledBook)
            if(findThisMostSelledBook){
                findThisMostSelledBook.sellCount += book.quantity
                await findThisMostSelledBook.save()
            }else{
                const mostSelledBooks = {
                    bookId : findBook._id,
                    bookCity : bookStoreInfos.city,
                    bookCategory : findBook.category,
                    sellCount : book.quantity
                }
                
                const mostSelledBookModel = new bookSellInfosModel(mostSelledBooks)
                await mostSelledBookModel.save()
                console.log(mostSelledBookModel)
            }
       

        }
        /*
        updateOrderStatus.items.forEach(async (book) => {
        
        })*/
        
        /*
        {
    bookId : "uniqueId", orderıtems içinden book id alınıcak ve bookcity ve category oradan çekilelecek
    bookCity : "Düzce", orderınfos içinde bookstoreid alınacak ve bu değer bookstorecitye gore guncellenecek
    sellCount : 2323, varsayılan olarak 0 ama eğer veritabanında bu id ve şehir ile ilgili değer varsa artmak zorunda
    bookCategory : "fiction"
    }
    gelen veri bu şekilde 
    eist
{ orderId: '6638b6ea9a1826fa90f424b0', orderStatus: 'Preparing' }
{
  customerInfos: {
    name: 'wdwd wdwdwd',
    email: 'findme@gmail.com',
    phoneNumber: '23123213223',
    address: 'deneme123'
  },
  _id: new ObjectId('6638b6ea9a1826fa90f424b0'),
  bookStoreId: '6638b32b14496760e91cdcc0',
  purchasingUserId: '6638b0045db18375dc016afa',
  items: [
    {
      bookName: 'bunu al',
      quantity: 2,
      price: 252,
      bookISBN: '12345678913',
    },
    {
      bookName: 'bunu da al',
      quantity: 1,
      price: 252,
      bookISBN: '12345678914',
    }
  ],
  totalAmount: 3,
  orderStatus: 'Preparing',
  paymentMethod: 'cash on delivery',
  orderRating: '0',
  customerNotes: '',
  orderDate: 2024-05-06T10:54:34.132Z,
}


*/



      }
    res.status(200).send({message : "order status was updated",updated : true})
    } catch (error) {
        console.error(error)
        res.status(500).send({updated : false, error})
    }
}

const addToCart = async (req,res) => {

    console.log(req.body)
    res.send()
}
module.exports = {
    profilePage,
    updateInfos,
    getUserInfos,
    addBook,
    addToCart,
    getOrders,
    updateOrderStatus
}