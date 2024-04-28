const { bookStoresBookModel,bookStoresModel,bookStoreOrdersModel,bookStoreCartModel } = require('../model/bookStores')
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
module.exports = { addBookStore, getBookStoresByField, getBookStoresBookByField }