const {usersModel,userCartModel,userFavBooksModel} = require('../model/users')
const {bookModel} = require('../model/books')

// I think this is not belong here
//bookstores variables should be defined here
const {bookStoresModel,bookStoreOrdersModel,bookStoreCartModel} = require('../model/bookStores')
//code replication in here 
const userAndBookStoresAddToCart = async (req,res) => {
    console.log(req.body)
    try {
        if(req.userId.ownerOfToken === "user"){
            const findThisBook = await userCartModel.findOne({userId : req.userId.tokenIsValid,bookId : req.body.bookId})
            console.log(findThisBook)
            if(!findThisBook){
                const userShoppingCardJSON = {
                    userId : req.userId.tokenIsValid,
                    bookId : req.body.bookId,
                    bookStoreId : req.body.sellerBookStoreInfos.bookStoreId,
                    bookPrice : req.body.sellerBookStoreInfos.price,
                    quantity : req.body.quantity,
                    bookName : req.body.bookName
                }
                //save to userCart
                const userShoppingCard = new userCartModel(userShoppingCardJSON)
                console.log(await userShoppingCard.save())
            }else{
               findThisBook.quantity +=1
               await findThisBook.save()
            }
            res.status(200).send({message : "book successfully added to cart"})
    
        }else if(req.userId.ownerOfToken == "bookStore"){
            const findThisBook = await bookStoreCartModel.findOne({purchasingBookstoreID : req.userId.tokenIsValid,bookId : req.body.bookId})
            console.log(findThisBook)
            if(!findThisBook){
                const bookStoreShoppingCardJSON = {
                    purchasingBookstoreID : req.userId.tokenIsValid,
                    bookId : req.body.bookId,
                    sellerBookStoreId : req.body.sellerBookStoreInfos.bookStoreId,
                    bookPrice : req.body.sellerBookStoreInfos.price,
                    quantity : req.body.quantity,
                    bookName : req.body.bookName
                }
                console.log("burasi")
                //save to userCart
                const bookStoreShoppingCard = new bookStoreCartModel(bookStoreShoppingCardJSON)
                console.log(await bookStoreShoppingCard.save())
            }else{
               findThisBook.quantity +=1
               await findThisBook.save()
            }
            res.status(200).send({message : "book successfully added to cart"})
        }else{
            console.log("login")
            res.staus(401).send({message : "please login add to cart this book"})
        }
    } catch (error) {
        console.error(error)
        res.status(500).send({message : "Book couldn't be added to the cart",error})
    }
}

const userOrBookStoresGetCardDetails = async(req,res) => {
    console.log(req.body)
    try {
        if(req.userId.ownerOfToken === "user"){

            console.log("asd")
            const shoppingListJSON = []
            const userShoppingList =  await userCartModel.find({userId : req.userId.tokenIsValid})
            //foreach olmalı burada
            console.log(userShoppingList)
            for(item in userShoppingList){
                console.log(item)
                const findBook = await bookModel.findById(userShoppingList[item].bookId)
                const findBookStore = await bookStoresModel.findById(userShoppingList[item].bookStoreId)
                shoppingListJSON.push(
                    {
                        bookName : findBook.name,
                        bookStoreName : findBookStore.name,
                        quantity : userShoppingList[item].quantity,
                        bookImages : findBook.images,
                        bookPrice : userShoppingList[item].bookPrice
        
                    }
                )
            }
            
            console.log(shoppingListJSON)
            res.status(200).send(shoppingListJSON)
        }else if(req.userId.ownerOfToken == "bookStore"){
           console.log("qwda")
        }
    } catch (error) {
        console.error(error)
        res.status(500).send({message : "Book couldn't be added to the cart",error})
    }

}
module.exports = {
    userAndBookStoresAddToCart,
    userOrBookStoresGetCardDetails
}
