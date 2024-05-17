const {
    bookStoresBookModel,
    bookStoresModel,
    bookStoreOrdersModel,
    bookStoreCartModel,
    bookStoresRatingsModel,
    monthOfBookstoreModel

} = require('../model/bookStores')
async function addBookStore(userData) {
    try {
        const bookStore = new bookStoresModel(userData)
        await bookStore.save()  
        return bookStore
    } catch (error) {
        return error
    }
   
}

async function getBookStoresByField(bookStoreData){
    const findBookStoreByFieldName = await bookStoresModel.find(bookStoreData)
    return findBookStoreByFieldName
}

async function getBookStoresBookByField(bookStoreData){
    const getBookStoreBooks = await bookStoresBookModel.find(bookStoreData)
    return getBookStoreBooks
}

async function addBookStoreRatings(bookStoreData){
    const newBookStoreRatingsModel = new bookStoresRatingsModel(bookStoreData)
    return await newBookStoreRatingsModel.save()
}

async function findBookStoreRating(bookStoreData,limitData){
    const findBookstoreRating = await bookStoresRatingsModel.find(bookStoreData).skip(limitData.skip).limit(limitData.limit)
    return findBookstoreRating
}

async function findMonthOfBookstores(bookStoreData,limitData){
    const findMonthOfBookStore = await monthOfBookstoreModel.find({bookStoreCity : bookStoreData.city , date : bookStoreData.date}).limit(limitData.limit)
    return findMonthOfBookStore
}
module.exports = {
    addBookStore,
    getBookStoresByField,
    getBookStoresBookByField,
    addBookStoreRatings,
    findBookStoreRating,
    findMonthOfBookstores

}