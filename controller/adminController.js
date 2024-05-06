const {bookCommentsModel,bookModel} = require('../model/books')
const {bookStoreCartModel,bookStoreOrdersModel,bookStoresModel,bookStoresBookModel} = require('../model/bookStores')
const {userBuyLaterModel,userCartModel,userWishListModel,userFavBooksModel,usersModel} = require('../model/users')
const {contactsModel} = require('../model/contacts')


//for mock data prep
const capitalAndNonCapital = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z','A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
const categories = ["Fiction","Non-Fiction","Science Fiction","Fantasy","Romance","Mystery","Thriller","History","Biography","Art","Music","Philosophy","Religion","Science","Technology","Medicine","Health","Psychology","Self-Help","Education","Children's Books","Young Adult Fiction","Comic Book","Humor","Cooking","Travel","Hobby","Sports","Other","Law","Business","Entertainment","Travel","Cooking","Gardening","Home and Family","Parenting","Pets","Crafts","Language","Science and Mathematics","History","Biology","Medicine","Psychology","Philosophy","Religion","Spirituality","Social Sciences","Politics","Education"]
const bookImagesPath = "public/uploads/bookImages/deneme123/1.png"
const numbers = ["1","2","3","4","5","6","7","8","9","0"]
const prepareMockForBooks = async (req,res) => {

  let bookName = ""
  let bookDescription = ""
  let bookAuthor = ""
  let bookISBN = ""
  //book count
  for(let j = 0; j < 150; j++){
  //name book name book description create random
  const nameLength = Math.floor((Math.random() + 1) * 5)
  for(let i = 0; i<nameLength;i++){
    bookName += capitalAndNonCapital[Math.floor(Math.random() * capitalAndNonCapital.length)]
    bookAuthor += capitalAndNonCapital[Math.floor(Math.random() * capitalAndNonCapital.length)]

  }
  const descLength = Math.random() * 200
  let count = 0
  for(let k = 0; k < descLength; k++){
    bookDescription += capitalAndNonCapital[Math.floor(Math.random() * capitalAndNonCapital.length)]
    if(count == 6){
      bookDescription += " "
      count = 0
    }
    count+=1
  }
  for(let p = 0; p < 10; p++){
    bookISBN += numbers[Math.floor(Math.random() * numbers.length)]
  }
  let bookObject = {
    "name" : bookName,
    "description" : bookDescription,
    "pageCount": Math.floor(Math.random() * 1000),
    "category": categories[Math.floor(Math.random() * categories.length)],
    "averageRating": (Math.random() * 5).toFixed(2),
    "author": bookAuthor,
    "ISBN" : bookISBN,
    "images" : { path: "public/uploads/bookImages/dds/1.png", index: 1 },
    "isValidBook" : false,
    "publicationDate": `${Math.floor((Math.random() + 1) * 1050 )}-${Math.floor((Math.random() * 11) + 1 )}-${Math.floor((Math.random() * 27) + 1 )}`
  }
  const newBook = new bookModel(bookObject)
  await newBook.save()
   bookName = ""
   bookDescription = ""
   bookAuthor = ""
   bookISBN = ""
}
  res.send()

}
  let bookstoreUsername = ""
  let bookStoreName = ""
  let bookStorePhoneNumber = ""
  let bookStorePhyscialAddress = ""
const prepareMockForBookStores = async (req,res) => {
  for(let g = 0; g < 100; g++){

  

  const nameLength = Math.floor((Math.random() + 1) * 5)
  for(let i = 0; i<nameLength;i++){
    bookStoreName += capitalAndNonCapital[Math.floor(Math.random() * capitalAndNonCapital.length)]
    bookstoreUsername += capitalAndNonCapital[Math.floor(Math.random() * capitalAndNonCapital.length)]

  }
  //phone number
  for(let k = 0; k < 10; k++){
    bookStorePhoneNumber += numbers[Math.floor(Math.random() * numbers.length)]
  }

  const descLength = Math.random() * 75
  let count = 0
  for(let k = 0; k < descLength; k++){
    bookStorePhyscialAddress += capitalAndNonCapital[Math.floor(Math.random() * capitalAndNonCapital.length)]
    if(count == 6){
      bookStorePhyscialAddress += " "
      count = 0
    }
    count+=1
  }
  bookstoreEmail = bookstoreUsername +"@gmail.com"
  bookStorePassword = bookstoreUsername + "123"


  const bookStore = {
    "name" : bookStoreName,
    "username" : bookstoreUsername,
    "email" : bookstoreEmail,
    "phoneNumber" : bookStorePhoneNumber,
    "password" : bookStorePassword,
    "city" : "Düzce",
    "physcialAddress" : bookStorePhyscialAddress
  }
  const newBookStore = new bookStoresModel(bookStore)
  await newBookStore.save()
  console.log(bookStore)

  bookstoreUsername = ""
  bookStoreName = ""
  bookstoreEmail = ""
  bookStorePhoneNumber = ""
  bookStorePassword = ""
  bookStorePhyscialAddress = ""
  }
  res.send()
}

const prepareMockForBookStoresBooks = async (req,res) => {
  const findbooks = await bookModel.find({})
  const findBookstores = await bookStoresModel.find({})
  for(const bookstoreIndex in findBookstores){
    //every bookstore must have 5 books
    for(let i = 0; i < 5; i++ ){
      const newBookStoresBook = {
        "bookStoreId" : findBookstores[bookstoreIndex].id,
        "bookId" : findbooks[Math.floor(Math.random() * findbooks.length)].id,
        "stockInfo" : Math.floor((Math.random() * 100) + 1),
        "price" : Math.floor((Math.random() * 2500) + 1)
      }
      const addbookToBookstoresBook = new bookStoresBookModel(newBookStoresBook)
      await addbookToBookstoresBook.save()
    }
  }


/*
  {
    "bookStoreId" : "65faec61f6e1bcfe6bb2d61f",
    "bookId" : "65faec87f6e1bcfe6bb2d625",
    "stockInfo" : 2,
    "price" : 356
  }
bookStoreId

bookId

stockInfo
2
price
32



{
  "_id": {
    "$oid": "65faec87f6e1bcfe6bb2d625"
  },
  "name": "deneme123",
  "description": "deneme123",
  "pageCount": 544,
  "category": "Sanat",
  "averageRating": 5,
  "publicationDate": "2024-03-15",
  "author": "deneme123",
  "ISBN": "12345678912",
  "images": [
    [
      {
        "index": 1,
        "path": "public/uploads/bookImages/deneme123/1.png"
      }
    ],
    [
      {
        "index": 2,
        "path": "public/uploads/bookImages/deneme123/2.png"
      }
    ]
  ],
  "isValidBook": false,
  "createdAt": {
    "$date": "2024-03-20T14:02:47.415Z"
  },
  "updatedAt": {
    "$date": "2024-03-20T14:02:47.415Z"
  },
  "__v": 0
}
*/
  
    res.send()
  }
module.exports = {
    prepareMockForBooks,
    prepareMockForBookStores,
    prepareMockForBookStoresBooks

}