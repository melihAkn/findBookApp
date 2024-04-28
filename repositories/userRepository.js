const { bookCommentsModel } = require('../model/books')
const { userFavBooksModel,userCartModel,usersModel,userBuyLaterModel,userWishListModel } = require('../model/users')

async function addUser(userData) {
    const user = new usersModel(userData)
    await user.save()  
    return user
}

async function getUserById(userId) {
    return usersModel.findById(userId)
}

async function getUsersByField(userInfo) {
    return usersModel.find(userInfo)
}

async function updateUser(userId, newData) {
    return usersModel.findByIdAndUpdate(userId, newData, { new: true })
}

async function deleteUser(userId) {
    return usersModel.findByIdAndDelete(userId)
}

async function findUserCartForThisBook(bookData) {
    return userCartModel.findOne(bookData)
}
async function deleteThisbookFromUserCart(bookData) {
    return userCartModel.deleteOne(bookData)
}

async function addBuyLaterList(bookData) {
    const buyLaterModel = new userBuyLaterModel(bookData)
    await buyLaterModel.save()
    return

}

async function findThisBookInWishList(bookData) {
    return userWishListModel.findOne(bookData)
}

async function addWishListThisBook(bookData) {
    const newlist = new userWishListModel(bookData)
    await newlist.save()
    return
}

async function updateWishList(bookData) {
    const updateWishList = await userWishListModel.updateOne({_id : bookData.id},bookData.update)
    console.log(updateWishList)
    return
}


module.exports = { 
    addUser,
    getUserById,
    getUsersByField,
    updateUser,
    deleteUser,
    addBuyLaterList,
    findUserCartForThisBook,
    deleteThisbookFromUserCart,
    findThisBookInWishList,
    addWishListThisBook,
    updateWishList

}