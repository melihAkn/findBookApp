const {usersModel,userCartModel,userFavBooksModel} = require('../model/users')
const {bookModel} = require('../model/books')
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
                userCartModel.findOneAndUpdate(userShoppingCardJSON)
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
                            shoppingListJSON[item].otherBookStores.push(findOtherBookStores)
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

const userOrBookStoresUpdateCardInfos = async (req,res) => {
    res.send()
}

const userOrBookStoresDeleteItem = async (req,res) => {
    res.send()
}




const userAndBookStoresCopmleteOrder = async (req,res) => {
    let findUser
    if(req.userId.ownerOfToken === "user"){
        findUser = await usersModel.findById(req.userId.tokenIsValid)
    }else if(req.userId.ownerOfToken === "bookStore"){
        findUser = await bookStoresModel.findById(req.userId.tokenIsValid)
    }
//ilk once order oluşturulacak sonra req bodysindeki bookstoreid ile kayıt aranacak ve itemlar o şekilde eklenecek
res.send()
}
module.exports = {
    userAndBookStoresAddToCart,
    userOrBookStoresGetCardDetails,
    userAndBookStoresCopmleteOrder
}
