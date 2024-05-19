const { usersModel,userCartModel,userFavBooksModel,userBuyLaterModel,userWishListModel } = require('../model/users')
const { bookModel,bookCommentsModel,bookSellInfosModel } = require('../model/books')
const { hash,compare } = require('bcrypt')
const { userInfos , updateUserInfos, buyLaterBook, addWishList, addCommentToBooks } = require('../services/userService')
const userProfilePageRender = (req,res) => {
    res.render('./pages/userPages/userProfilePage',{layout : req.layout})
}
const getUserInfos = async (req,res) => {
    const getUserInfos = await userInfos({_id : req.userId.tokenIsValid})
    res.status(200).send(getUserInfos[0])
}
const updateInfos = async (req,res) => {
    console.log(req.body)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(req.body.email) || !/^[a-zA-Z0-9]{3,}$/.test(req.body.username) || !/^[a-zA-Z]{3,}$/.test(req.body.name) || !/^[a-zA-Z]{3,}$/.test(req.body.surname) || !/^\+?\d{10,14}$/.test(req.body.phoneNumber) || req.body.password.length < 8 ) {
        return res.status(400).json({ error: 'Invalid infos' })
      }
    const update = await updateUserInfos({userId : req.userId.tokenIsValid , body : req.body})
    res.status(200).send(update)
}

const buyLaterThisBook = async (req,res) => {
    const buyLaterFunc = await buyLaterBook({id : req.userId.tokenIsValid , body : req.body})
    res.status(200).send(buyLaterFunc)
    
    
}

const addToWishList = async (req,res) => {

    const addWishListFunc = await addWishList({id : req.userId.tokenIsValid , body : req.body})
    res.status(200).send(addWishListFunc)

}

const addComment = async (req,res) => {
        // users cannot add comment more than 1 to books
        if(req.userId.ownerOfToken === "user"){
            const addCommentFunc = await addCommentToBooks({id : req.userId.tokenIsValid, body : req.body})
            res.status(200).send(addCommentFunc)
        }else{
            res.status(401).send({message : "only users can add comment books"})
        }
}

// I think this is not belong here so bookstores variables should be defined here
const {bookStoresModel,bookStoreOrdersModel,bookStoreCartModel, bookStoresBookModel ,monthOfBookstoreModel , bookStoresRatingsModel} = require('../model/bookStores')
//code replication in here 
const userAndBookStoresAddToCart = async (req,res) => {
    let userShoppingCardJSON
    try {
        if(req.userId.ownerOfToken === "user"){
            const findThisBook = await userCartModel.findOne({userId : req.userId.tokenIsValid,bookId : req.body.bookId ,bookStoreId : req.body.sellerBookStoreInfos.bookStoreId})
            if(!findThisBook){
                 userShoppingCardJSON = {
                    userId : req.userId.tokenIsValid,
                    bookId : req.body.bookId,
                    bookStoreId : req.body.sellerBookStoreInfos.bookStoreId,
                    bookPrice : req.body.sellerBookStoreInfos.price,
                    quantity : req.body.quantity,
                    bookName : req.body.bookName
                }
                //save to userCart
                const userShoppingCard = new userCartModel(userShoppingCardJSON)
                await userShoppingCard.save()
            }else{
               findThisBook.quantity +=1
               await findThisBook.save()
            }
            res.status(200).send({message : "book successfully added to cart"})
    
        }else if(req.userId.ownerOfToken == "bookStore"){
            const findThisBook = await bookStoreCartModel.findOne({purchasingBookstoreID : req.userId.tokenIsValid,bookId : req.body.bookId})
            if(!findThisBook){
                const bookStoreShoppingCardJSON = {
                    purchasingBookstoreID : req.userId.tokenIsValid,
                    bookId : req.body.bookId,
                    sellerBookStoreId : req.body.sellerBookStoreInfos.bookStoreId,
                    bookPrice : req.body.sellerBookStoreInfos.price,
                    quantity : req.body.quantity,
                    bookName : req.body.bookName
                }
                //save to userCart
                const bookStoreShoppingCard = new bookStoreCartModel(bookStoreShoppingCardJSON)
                await bookStoreShoppingCard.save()
            }else{
               findThisBook.quantity +=1
               await findThisBook.save()
            }
            res.status(200).send({message : "book successfully added to cart"})
        }else{
            res.staus(401).send({message : "please login add to cart this book"})
        }
    } catch (error) {
        console.error(error)
        res.status(500).send({message : "Book couldn't be added to the cart",error})
    }
}

const userAndBookStoresAddToFavorite = async (req,res) => {
    try {
        const favoriteBook = {
            userId : req.userId.tokenIsValid,
            bookId : req.body.bookId
        }
        const addToFavorite = new userFavBooksModel(favoriteBook)
        await addToFavorite.save()
        res.status(200).send({message : "this book added to a favorite"})

    } catch (error) {
        console.error(error)
        res.status(500).send({message : "there was an error" , error})
    }
}
const userOrBookStoresGetCardDetails = async(req,res) => {
    try {
        if(req.userId.ownerOfToken === "user"){
            const shoppingListJSON = []
            const userShoppingList =  await userCartModel.find({userId : req.userId.tokenIsValid})
            const findUser = await usersModel.findById(req.userId.tokenIsValid)
            for(item in userShoppingList){
                const findBook = await bookModel.findById(userShoppingList[item].bookId)
                const findBookStore = await bookStoresModel.findById(userShoppingList[item].bookStoreId)
                shoppingListJSON.push(
                    {
                        bookId : findBook._id,
                        bookName : findBook.name,
                        bookStoreName : findBookStore.name,
                        bookStoreId : findBookStore._id,
                        quantity : userShoppingList[item].quantity,
                        bookImages : findBook.images,
                        bookPrice : userShoppingList[item].bookPrice,
                        otherBookStores : []
                    }
                )
                    const findOtherSellersOfThisBook = await bookStoresBookModel.find({bookId : findBook._id })
                    for(let index in findOtherSellersOfThisBook){
                        const findOtherBookStores = await bookStoresModel.findOne({_id : findOtherSellersOfThisBook[index].bookStoreId , city : findUser.city})
                        if(findOtherBookStores != null){
                            if(findOtherBookStores._id != findBookStore._id && !shoppingListJSON[item].otherBookStores.find(store => store.id === findOtherBookStores.id && store.id == findBookStore.id)) {
                                const findBookstoresBookPrice = await bookStoresBookModel.findOne({bookStoreId : findOtherBookStores.id , bookId : findBook.id})
                                const newStore = {
                                    ...findOtherBookStores.toObject(),
                                    price: findBookstoresBookPrice.price
                                }
                                shoppingListJSON[item].otherBookStores.push(newStore)
                            }else{

                            }
                        }
                    }
            }
            res.status(200).send(shoppingListJSON)
        }else if(req.userId.ownerOfToken == "bookStore"){
        }
    } catch (error) {
        console.error(error)
        res.status(500).send({message : "error retrieving your shopping card data",error})
    }
}
//bookstore update

const userOrBookStoresUpdateOrDeleteItem = async (req,res) => {
    console.log(req.body)
    try {
        for(let item in req.body){
            if(parseInt(req.body[item].quantity) == 0){
                await userCartModel.findOneAndDelete({bookName : req.body[item].bookName , bookStoreId : req.body[item].bookStoreId , bookPrice : req.body[item].bookPrice , userId : req.userId.tokenIsValid})
            }else{
                //if req.body book quantity is bigger than bookstores stock set the quantity bookstores book quantity
                const updateThis = await userCartModel.updateOne({bookName : req.body[item].bookName , userId : req.userId.tokenIsValid} , {$set : {quantity : parseInt(req.body[item].quantity), bookStoreId : req.body[item].bookStoreId,bookPrice : req.body[item].bookPrice}}, { new: true })
                console.log(updateThis)
            }

        }
        res.status(200).send({message : "cart was updated successfully"})
    } catch (error) {
        res.status(500).send({error})
    }
   
}

const userAndBookStoresCopmleteOrder = async (req,res) => {
    let findUser
    try {
        if(req.userId.ownerOfToken === "user"){
            findUser = await usersModel.findById(req.userId.tokenIsValid)
            //get total Amount
            let totalAmount = 0
            for(const item in req.body){
                totalAmount += req.body[item].quantity
            }
            const customerOrder = {
                bookStoreId : req.body[0].bookStoreId,
                purchasingUserId : req.userId.tokenIsValid,
                customerInfos : {
                    name : findUser.nameAndSurname,
                    email : findUser.email,
                    phoneNumber : findUser.phoneNumber,
                    address : findUser.physcialAddress
                },
                items : [],
                totalAmount,
                paymentMethod : "cash on delivery",
            }
            for (const item in req.body){
                const findBook = await bookModel.findById(req.body[item].bookId)
                customerOrder.items.push({
                    bookName : req.body[item].bookName,
                    quantity : req.body[item].quantity,
                    price : req.body[item].bookPrice,
                    bookISBN : findBook.ISBN               
                })

            }
            const createOrder = new bookStoreOrdersModel(customerOrder)
            await createOrder.save()
            const deleteUserShoppingCard = await userCartModel.deleteMany({userId : req.userId.tokenIsValid})
            //creating bookstore order and month of bookstore collections
            const orderDate = new Date()
            const year = orderDate.getFullYear();
            const month = (orderDate.getMonth() + 1).toString().padStart(2, '0')
            const yearMonth = `${year}-${month}`

            const findThisBookStoreRating = await bookStoresRatingsModel.find({bookStoreId : req.body[0].bookStoreId})
            const findThisMonthOfbookStore = await monthOfBookstoreModel.find({bookStoreId : req.body[0].bookStoreId , date : yearMonth})
            const findBookStoreCity = await bookStoresModel.findById(req.body[0].bookStoreId)
            if(findThisBookStoreRating.length > 0){
                findThisBookStoreRating[0].orderCount += customerOrder.totalAmount
                await findThisBookStoreRating[0].save()

            }else{
                const bookStoresRatings = {
                    bookStoreId : req.body[0].bookStoreId,
                    orderCount : customerOrder.totalAmount,
                    sumOfOrderRatings : 0,
                    bookStoreRating : 0
                }
                const newBookStoreRatingModel = new bookStoresRatingsModel(bookStoresRatings)
                await newBookStoreRatingModel.save()
            }
            if(findThisMonthOfbookStore.length > 0){
                findThisMonthOfbookStore[0].orderCount += customerOrder.totalAmount
                await findThisMonthOfbookStore[0].save()
            }else{
                
                const monthOfBookstoreData = {
                    date : yearMonth,
                    orderCount : customerOrder.totalAmount,
                    bookStoreId : req.body[item].bookStoreId,
                    bookSotreRating : 0,
                    suomOfOrderRatings : 0,
                    bookStoreCity : findBookStoreCity.city
                }
                const newMonthOfBookstoreModel = new monthOfBookstoreModel(monthOfBookstoreData)
                await newMonthOfBookstoreModel.save()
            }
            //creating a bookSellInfos model
           
            /* customer order json
   customerOrder.items.push({
                    bookName : req.body[item].bookName,
                    quantity : req.body[item].quantity,
                    price : req.body[item].bookPrice,
                    bookISBN : findBook.ISBN               
                })
            */
            for(const item of customerOrder.items){
                const findThisBookInfos = await bookModel.findOne({ISBN : item.bookISBN})
                const findThisBookSellInfos = await bookSellInfosModel.find({bookId : findThisBookInfos._id , bookCity : findBookStoreCity.city })
                if(findThisBookSellInfos.length > 0){
                    const bookSellInfos = {
                        bookCity : findBookStoreCity.city,
                        sellCount : item.quantity,
                        bookCategory : findThisBookInfos.category
                    }
                    findThisBookSellInfos[0].sellCount += item.quantity
                    await findThisBookSellInfos[0].save()

                }else{
                    const bookSellInfos = {
                        bookId : findThisBookInfos._id,
                        bookCity : findBookStoreCity.city,
                        sellCount : item.quantity,
                        bookCategory : findThisBookInfos.category
                    }
                    const newBookSellInfosModel = new bookSellInfosModel(bookSellInfos)
                    await newBookSellInfosModel.save()

                }
            }

            res.status(200).send({message : "sipariş başarılı bir şekilde oluşturuldu. siparişinizi profil sayfanızda görebilirsiniz"})
    
        }else if(req.userId.ownerOfToken === "bookStore"){
            findUser = await bookStoresModel.findById(req.userId.tokenIsValid)
    
    
    
    
    
        }
    } catch (error) {
        console.error(error)
        res.status(500).send(error)
    }
   
}




const getUserOrders = async (req,res) => {

    try {
        let orders =[]
        const findUserOrders = await bookStoreOrdersModel.find({purchasingUserId : req.userId.tokenIsValid}) 
        for(const item in findUserOrders){
            const findBookStores = await bookStoresModel.findById(findUserOrders[item].bookStoreId)
            orders.push({
                items : findUserOrders[item].items,
                orderStatus : findUserOrders[item].orderStatus,
                orderDate : findUserOrders[item].orderDate,
                paymentMethod : findUserOrders[item].paymentMethod,
                bookstoreName : findBookStores.name,
                bookstorePhyscialAddress : findBookStores.physcialAddress
            })
      }
      res.status(200).send(orders)
    } catch (error) {
        res.status(500).send(error)
    }

}

module.exports = {
    userProfilePageRender,
    getUserInfos,
    updateInfos,
    addToWishList,
    addComment,
    //bookstores and user routes maybe not belong here I dont know
    userAndBookStoresAddToCart,
    userAndBookStoresAddToFavorite,
    userOrBookStoresGetCardDetails,
    userAndBookStoresCopmleteOrder,
    userOrBookStoresUpdateOrDeleteItem,
    getUserOrders,
    buyLaterThisBook
    
}
