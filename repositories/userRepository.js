const { userFavBooksModel,userCartModel,usersModel,userBuyLaterModel,userWishListModel } = require('../model/users')

async function addUser(userData) {
    try {
        const user = new usersModel(userData)
        await user.save()  
        return user
    } catch (error) {
        return error
    }
   
}

async function getUserById(userId) {
    return usersModel.findById(userId)
}

async function getUsersByField(userInfo){
    return usersModel.find(userInfo)
}

async function updateUser(userId, newData) {
    return User.findByIdAndUpdate(userId, newData, { new: true })
}

async function deleteUser(userId) {
    return User.findByIdAndDelete(userId)
}

module.exports = { addUser, getUserById, getUsersByField, updateUser, deleteUser }