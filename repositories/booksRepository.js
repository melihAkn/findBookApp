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

async function searchBookByFieldName(bookData,limitData){
    console.log(limitData)
    const getBooksByName = await bookModel.find(bookData).skip(limitData.start).limit(limitData.limit)
    return getBooksByName
}
async function countBooks(){
    return await bookModel.countDocuments()
}
async function getCommentsByFieldName(bookData){
    const getComments = await bookCommentsModel.find(bookData)
    return getComments
}

async function newComment(commentData) {
    const newCommentModel = new bookCommentsModel(commentData)
    await newCommentModel.save()
    return newCommentModel
}
module.exports = { addBook , searchBookByFieldName , getCommentsByFieldName , newComment , countBooks}
