const { searchBookByFieldName , getCommentsByFieldName , countBooks } = require('../repositories/booksRepository')
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



module.exports = { searchedBookInfos , getBookComments , getCountBooks}
