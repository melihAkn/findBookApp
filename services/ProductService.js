const { searchBookByFieldName , getCommentsByFieldName , countBooks, booksSellInfos } = require('../repositories/booksRepository')
const { getBookStoresByField, getBookStoresBookByField } = require('../repositories/bookStoreRepository')
// bookstore ınfos
async function searchedBookInfos(bookData) {
    let books = []
    //const findAllBooks = await bookModel.find({ name : bookData.name })
    const findAllBooksByName = await searchBookByFieldName({name : bookData.name },{start : bookData.skip , limit : bookData.limit})
    const findBookStoresInSearchedCity = await getBookStoresByField({ city : bookData.city })
    for (const bookStore of findBookStoresInSearchedCity) {
        //
        const bookStoresBooks = await getBookStoresBookByField({ bookStoreId : bookStore._id})
        for (const bookStoresBook of bookStoresBooks) {
            const foundBook = findAllBooksByName.find(book => book._id.toString() === bookStoresBook.bookId.toString())
    
            if (foundBook) {
                const existingBookIndex = books.findIndex(book => book._id.toString() === foundBook._id.toString())
                // -1 mean book cannot be found
                if (existingBookIndex !== -1) {
                    books[existingBookIndex].bookStoreInfos.push({
                        bookStoreId: bookStore._id,
                        bookStoreName : bookStore.name,
                        stockInfo: bookStoresBook.stockInfo,
                        price: bookStoresBook.price
                    })
                } else {
                    books.push({
                        _id: foundBook._id,
                        name: foundBook.name,
                        description: foundBook.description,
                        pageCount: foundBook.pageCount,
                        category: foundBook.category,
                        averageRating: foundBook.averageRating,
                        publicationDate: foundBook.publicationDate,
                        author: foundBook.author,
                        ISBN: foundBook.ISBN,
                        images: foundBook.images,
                        isValidBook: foundBook.isValidBook,
                        bookStoreInfos: [{
                            bookStoreId: bookStore._id,
                            bookStoreName : bookStore.name,
                            stockInfo: bookStoresBook.stockInfo,
                            price: bookStoresBook.price
                        }]
                    })
                }
            }

        }
        for(index in books){
            books[index].bookStoreInfos.sort((a,b) => a.price - b.price)
        }
    }
    if(books.length == 0){
        books = findAllBooksByName
        return { message : "There are no bookstores selling the searched book or books in the city. you can add to wishlist searched books ",bookFound : false ,books}
    }else{
        
        return {books , bookFound : true}
    }
    


}
async function getCountBooks(_) {
    const bookC = await countBooks()
    return bookC

}
async function getBookComments(bookData) {
    const getComments = await getCommentsByFieldName(bookData)
    return getComments
} 

async function MostSelledBooksByCity(bookData) {
    const getBooksSellInfos = await booksSellInfos({bookCity : bookData.city},25)
    return getBooksSellInfos


}

async function MostSelledBooksInAllCity(bookData) {

    const getBooksSellInfos = await booksSellInfos({bookCity : bookData.city},25)
    

}

async function BooksByBasedMostPopularCategorys(bookData) {


}

async function mostReliableBookstores(bookStoreData) {



}

async function newlyAddedBooks(bookData) {


}

async function bookByBasedMostPopularCategories(bookData) {


}

async function monthOfBookstores(bookstoreData) {



}

async function popularAndRisingBookstores(bookstoreData) {

}

async function aiSuggestedThisBooks(bookData) {

}

module.exports = {
    searchedBookInfos,
    getBookComments,
    getCountBooks,
    MostSelledBooksByCity,
    MostSelledBooksInAllCity,
    BooksByBasedMostPopularCategorys,
    mostReliableBookstores,
    newlyAddedBooks,
    bookByBasedMostPopularCategories,
    monthOfBookstores,
    popularAndRisingBookstores,
    aiSuggestedThisBooks,
    searchedBookInfos
    
    }
