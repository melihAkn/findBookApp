const { searchBookByFieldName , getCommentsByFieldName , countBooks, booksSellInfos, getBookById } = require('../repositories/booksRepository')
const { getBookStoresByField, getBookStoresBookByField, addBookStoreRatings , findBookStoreRating, findMonthOfBookstores, getBookStoresById } = require('../repositories/bookStoreRepository')
// bookstore infos
async function searchedBookInfos(bookData,limitData) {
    console.time("elapsed Time")
    let searchedBooks = []
    //getting all the data once
    let bookStores = await getBookStoresByField()
    let books = await searchBookByFieldName({},{start : 0 , limit : null})
    const findBookStoresBooksByGivenCity = await getBookStoresBookByField(limitData)
    for(const bookStoresBook of findBookStoresBooksByGivenCity){
        //finding index in bookStoresBooks by bookId and bookStoreId
       const findThisBook = books.findIndex(books => books._id.toString() === bookStoresBook.bookId.toString())
       const findThisBookStore = bookStores.findIndex(bookStore => bookStore._id.toString() === bookStoresBook.bookStoreId.toString())
       const findBookIndex = searchedBooks.findIndex(book => book._id.toString() === bookStoresBook.bookId.toString())
       //if index is not found do nothing just continue(I dont know why isnt find an index)
       if(findThisBook !== -1 || findThisBookStore !== -1){

       if(findBookIndex !== -1){
        //if book already in array just add a new seller and sort it by price
        searchedBooks[findBookIndex].bookStoreInfos.push({
            bookStoreId: bookStores[findThisBookStore]._id,
            bookStoreName : bookStores[findThisBookStore].name,
            stockInfo: bookStoresBook.stockInfo,
            price: bookStoresBook.price
        })
        searchedBooks[findBookIndex].bookStoreInfos.sort((a,b) => a.price - b.price)
       }else{
        //if books doesnt find create a new book infos
        searchedBooks.push({
            _id: books[findThisBook]._id,
            name: books[findThisBook].name,
            description: books[findThisBook].description,
            pageCount: books[findThisBook].pageCount,
            category: books[findThisBook].category,
            averageRating: books[findThisBook].averageRating,
            publicationDate: books[findThisBook].publicationDate,
            author: books[findThisBook].author,
            ISBN: books[findThisBook].ISBN,
            images: books[findThisBook].images,
            isValidBook: books[findThisBook].isValidBook,
            bookStoreInfos: [{
                bookStoreId: bookStores[findThisBookStore]._id,
                bookStoreName : bookStores[findThisBookStore].name,
                stockInfo: bookStoresBook.stockInfo,
                price: bookStoresBook.price
            }]
           })
       }
    }
    }
    console.timeEnd("elapsed Time")
    //if array is emtpty there is no bookstore so we return this
    if(searchedBooks.length == 0){
        return {books, message : "There are no bookstores selling the searched book or books in the city. you can add to wishlist searched books ",bookFound : false ,books}
    }else{
        return {books : searchedBooks , bookFound : true}
    }
    //this is the old one i dont want to delete it
   /*
    const findAllBooksByName = await searchBookByFieldName(bookData,{start : limitData.skip , limit : limitData.limit})
    const findBookStoresInSearchedCity = await getBookStoresByField({ city : limitData.city })
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
    console.timeEnd()
    if(books.length == 0){
        books = findAllBooksByName
        return { message : "There are no bookstores selling the searched book or books in the city. you can add to wishlist searched books ",bookFound : false ,books}
    }else{
        
        return {books , bookFound : true}
    }
        */
}
async function getCountBooks(bookData) {
    const bookC = await countBooks({userCity : bookData.userCity})
    return bookC

}
async function getBookComments(bookData) {
    const getComments = await getCommentsByFieldName(bookData)
    return getComments
} 

async function mostSelledBooksByCity(bookData) {
    const getBooksSellInfos = await booksSellInfos({bookCity : bookData.city},25)
    return getBooksSellInfos


}




async function mostPopularCategorys(bookData) {
    // getting most popular category from books sell infos table 
    // and fill an array return the categorys
    const categorys = require('../public/frontendStuff/bookCategories.json')
    const getBooksSellInfos = await booksSellInfos({bookCity :bookData.city},25)
    let mostPopularCategory = []
    for(let i = 0; i < categorys.length; i++){
        mostPopularCategory.push({bookCategory : categorys[i],count : 0})
    }
    for(const item of getBooksSellInfos){
        for(let k = 0; k < mostPopularCategory.length; k++){
            if(item.bookCategory == mostPopularCategory[k].bookCategory){
                mostPopularCategory[k].count +=1
            }
        }
    }
    mostPopularCategory.sort((a,b) => b.count - a.count)
    const firstFivePopularCategories = mostPopularCategory.slice(0,5) 
    return firstFivePopularCategories
}






async function aiSuggestedThisBooks(bookData) {
}




async function mostReliableBookstores(bookStoreData,limitData) {
    const getBookstoreRatings = await findBookStoreRating(bookStoreData,limitData)
    let mostReliableBs = []
    for(const item of getBookstoreRatings){
        const detailedBookStoreInfos = await getBookStoresByField({_id : item.bookStoreId })
        mostReliableBs.push({
            _id : item.bookStoreId,
            bookStoreName : detailedBookStoreInfos[0].name,
            city : detailedBookStoreInfos[0].city,
            physcialAdress : detailedBookStoreInfos[0].physcialAddress,
            bookStoreImages : detailedBookStoreInfos[0].bookStoreImages,
            orderCount : item.orderCount,
            bookStoreRating : item.bookStoreRating
        })
    }
    return mostReliableBs


}
async function monthOfBookstores(bookStoreData) {
    const getMonthOfBookStores = await findMonthOfBookstores(bookStoreData,{limit : 10})
   let monthOfBookStoresArray = []
    for(const item of getMonthOfBookStores){
        const detailedBookStoreInfos = await getBookStoresByField({_id : item.bookStoreId})
        console.log(detailedBookStoreInfos)
        monthOfBookStoresArray.push({
            _id : item.bookStoreId,
            bookStoreName : detailedBookStoreInfos[0].name,
            city : item.bookStoreCity,
            physcialAdress : detailedBookStoreInfos[0].physcialAddress,
            bookStoreImages : detailedBookStoreInfos[0].bookStoreImages,
            orderCount : item.orderCount,
            bookStoreRating : item.bookStoreRatings,
            date : item.date
        })
    }
    console.log(monthOfBookStoresArray)
    return monthOfBookStoresArray


}

async function popularAndRisingBookstores(bookStoreData) {
    let popularAndRisingBs = []
    const getMonthOfBookStores = await findMonthOfBookstores(bookStoreData,{limit : 10})
    for (const item of getMonthOfBookStores) {
        const findBookStore = await getBookStoresByField({ _id: item.bookStoreId, city: item.bookStoreCity })

        if (findBookStore.length > 0 && findBookStore[0].createdAt) {
            const createdAtDate = new Date(findBookStore[0].createdAt)
            const currentDate = new Date()
            //convert miliseconds to day
            const differenceInDays = (currentDate - createdAtDate) / (1000 * 60 * 60 * 24)

            if (differenceInDays <= 30) {
                popularAndRisingBs.push(item)
            }
        }
    }
    return popularAndRisingBs
}



module.exports = {
    searchedBookInfos,
    getBookComments,
    getCountBooks,
    mostSelledBooksByCity,
    mostPopularCategorys,
    mostReliableBookstores,
    monthOfBookstores,
    popularAndRisingBookstores,
    aiSuggestedThisBooks,
    searchedBookInfos
    
    }
