const { userFavBooksModel,userCartModel,usersModel,userBuyLaterModel,userWishListModel } = require('../model/users')
const { bookModel, bookCommentsModel } = require('../model/books')
async function addBook(bookData) {
    try {
        const user = new usersModel(userData)
        await user.save()  
        return user
    } catch (error) {
        return error
    }
   
}

async function searchBookByFieldName(bookData){
    const getBooksByName = await bookModel.find(bookData)
    return getBooksByName
}

async function getCommentsByFieldName(bookData){
    const getComments = await bookCommentsModel.find(bookData)
    return getComments
}


module.exports = { addBook , searchBookByFieldName , getCommentsByFieldName}
