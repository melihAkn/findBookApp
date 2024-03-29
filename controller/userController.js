const {usersModel,userCartModel,userFavBooksModel} = require('../model/users')
const {bookModel} = require('../model/books')
const {hash,compare} = require('bcrypt')
const userProfilePageRender = (req,res) => {
    res.render('./pages/userPages/userProfilePage',{layout : req.layout})
}
const getUserInfos = async (req,res) => {
    try {
        const getUserInfos = await usersModel.findOne({_id : req.userId.tokenIsValid}).select("-_id -password -createdAt -updatedAt -__v")
        res.status(200).send(getUserInfos)
    } catch (error) {
        res.status(500).send({error})
    }
}
const updateInfos = async (req,res) => {
    const userId = req.userId.tokenIsValid
    console.log(userId)
    try {
        const findUser = await usersModel.findById(userId)
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
                const updateUserInfos = await usersModel.updateOne({_id : userId},updateData)
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
                const updateUserInfos = await usersModel.updateOne({_id : userId},updateData)
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




// I think this is not belong here so bookstores variables should be defined here
const {bookStoresModel,bookStoreOrdersModel,bookStoreCartModel, bookStoresBookModel} = require('../model/bookStores')
//code replication in here 
const userAndBookStoresAddToCart = async (req,res) => {
    console.log(req.body)
    let userShoppingCardJSON
    try {
        if(req.userId.ownerOfToken === "user"){
            const findThisBook = await userCartModel.findOne({userId : req.userId.tokenIsValid,bookId : req.body.bookId})
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
                        bookName : findBook.name,
                        bookStoreName : findBookStore.name,
                        bookStoreId : findBookStore.id,
                        quantity : userShoppingList[item].quantity,
                        bookImages : findBook.images,
                        bookPrice : userShoppingList[item].bookPrice,
                        otherBookStores : []
                    }
                )
                    const findOtherSellersOfThisBook = await bookStoresBookModel.find({bookId : findBook.id })
                    for(let index in findOtherSellersOfThisBook){
                        const findOtherBookStores = await bookStoresModel.findOne({_id : findOtherSellersOfThisBook[index].bookStoreId , city : findUser.city})
                        if(findOtherBookStores.id != findBookStore.id && !shoppingListJSON[item].otherBookStores.find(store => store.id === findOtherBookStores.id && store.id == findBookStore.id)) {
                            const findBookstoresBookPrice = await bookStoresBookModel.findOne({bookStoreId : findOtherBookStores.id , bookId : findBook.id})
                            const newStore = {
                                ...findOtherBookStores.toObject(),
                                price: findBookstoresBookPrice.price
                              }
                            shoppingListJSON[item].otherBookStores.push(newStore)
                        }
                    }
            }
            res.status(200).send(shoppingListJSON)
        }else if(req.userId.ownerOfToken == "bookStore"){
           console.log("qwda")
        }
    } catch (error) {
        console.error(error)
        res.status(500).send({message : "error retrieving your shopping card data",error})
    }
}
//bookstore update
const userOrBookStoresUpdateCardInfos = async (req,res) => {
    res.send()
}
//quantity update
const userOrBookStoresDeleteItem = async (req,res) => {
    try {
        if(req.body.quantity == 0){
            await userCartModel.findOneAndDelete({bookName : req.body.bookName , bookStoreId : req.body.bookStoreId , bookPrice : req.body.bookPrice , userId : req.userId.tokenIsValid})
            res.status(200).send({message : "this book was deleted" , deleted : true}) 
        }else{
            await userCartModel.findOneAndUpdate({bookName : req.body.bookName , bookStoreId : req.body.bookStoreId , bookPrice : req.body.bookPrice , userId : req.userId.tokenIsValid} , {$set : {quantity : parseInt(req.body.quantity)}}, { new: true })
            res.status(200).send({message : "this book was updated" , updated : true})
        }
    } catch (error) {
        res.status(500).send({error , deleted : false , updated : false})
    }
   
}




const userAndBookStoresCopmleteOrder = async (req,res) => {
    let findUser
    try {
        if(req.userId.ownerOfToken === "user"){
            findUser = await usersModel.findById(req.userId.tokenIsValid)
            //console.log(req.body)
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
                paymentMethod : "cash on delivery"
            }
            for (const item in req.body){
                customerOrder.items.push({
                    bookName : req.body[item].bookName,
                    quantity : req.body[item].quantity,
                    price : req.body[item].bookPrice
                })

            }
            console.log(customerOrder)
            const createOrder = new bookStoreOrdersModel(customerOrder)
            await createOrder.save()
            console.log(createOrder)
            const deleteUserShoppingCard = await userCartModel.deleteMany({userId : req.userId.tokenIsValid})

            res.status(200).send({message : "order created successfully you can show order infos profile page"})
    
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
    //bookstores and user routes maybe not belong here I dont know
    userAndBookStoresAddToCart,
    userOrBookStoresGetCardDetails,
    userAndBookStoresCopmleteOrder,
    userOrBookStoresDeleteItem,
    getUserOrders
    
}
