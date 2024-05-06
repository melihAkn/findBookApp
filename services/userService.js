const { addUser, getUsersByField, getUserById, updateUser, findUserCartForThisBook, deleteThisbookFromUserCart, findThisBookInWishList , addWishListThisBook, updateWishList } = require('../repositories/userRepository')
const { addBookStore, getBookstoresById, getBookStoresByField } = require('../repositories/bookStoreRepository')
const { hash , compare } = require('bcrypt')
const {sign,verify} = require('jsonwebtoken')
const { newComment } = require('../repositories/booksRepository')
const userSecretKey = process.env.JWT_USER_SECRET_KEY

//user funcs
async function createUser(userData) {
  console.log(userData)
    const password = userData.password
    let userRegisterInfos = {
      nameAndSurname : userData.name + " " + userData.surname,
      username : userData.username,
      email : userData.email,
      password : "",
      city : userData.city,
      physcialAddress : userData.physcialAddress,
      phoneNumber : userData.phoneNumber
    }
    await hash(password, 10).then(async function(hash) {
      userRegisterInfos.password = hash
    })
    .catch(e => {
        return {userCreated : false , error : e}

    })

    const returnedUser = await addUser(userRegisterInfos)
    if(returnedUser.createdAt){
      return {userCreated : true , returnedUser}
    }else{
      return {userCreated : false ,returnedUser}
    }
}


async function loginUser(userData) {
    let userFilter = {
      username : userData.username
    }
    const findUser = await getUsersByField(userFilter)
    console.log(findUser)
    if(findUser.length < 1){
      return {message : "username or password wrong" , loginAttemp : false}
    }else{

    const comparePassword = await compare(userData.password,findUser[0].password)
          //bool return true or false
          .then(async data => {
            if(data){
                const userToken = sign(findUser[0].id,userSecretKey)
                return {cookie : userToken , loginAttemp : true}
            }else{
              return {loginAttemp : false}
            }
          })
          .catch(e => {
            return {error : true , code : 500 , message : "compare error" , actualError : e}
          })
          console.log(comparePassword)
          return comparePassword
        }
}

async function userInfos(userData) {
  const getUser = await getUsersByField(userData)
  console.log(getUser)
  return getUser

}

async function updateUserInfos(userData) {
  const userId = userData.userId

  const findUser = await getUserById(userId)
  

  const compareUserPassword = compare(userData.body.password , findUser.password)
  if(compareUserPassword){
      //update
      if(userData.body.newPassword){
          userData.body.password = userData.body.newPassword
          await hash(userData.body.password, 10).then(async function(hash) {
              userData.body.password = hash
          })
          const updateData = {
              name : userData.body.name,
              username : userData.body.username,
              password : userData.body.password,
              email : userData.body.email,
              phoneNumber : userData.body.phoneNumber,
              physcialAddress : userData.body.physcialAddress
          }
          //update here
          const updateUserInfos = await updateUser(userId,updateData)
          
      }else{
          //direct update
          const updateData = {
              name : userData.body.name,
              username : userData.body.username,
              email : userData.body.email,
              phoneNumber : userData.body.phoneNumber,
              physcialAddress : userData.body.physcialAddress
          }
          //update here
          const updateUserInfos = await updateUser(userId,updateData)
      }
      return {message : "Infos updated successfully" , updated : true}
  }
  else{
    return {message : "wrong password" , updated : false}
  }


}

async function buyLaterBook(userData) {
  const cartData = {
    bookName : userData.body.bookName,
    bookStoreId : userData.body.bookStoreId,
    bookPrice : userData.body.bookPrice,
    quantity : userData.body.quantity,
    userId : userData.id.tokenIsValid
  }
  findThisBook = await findUserCartForThisBook(cartData)
  const buyLaterJSON = {
      userId : userData.id.tokenIsValid,
      quantity : findThisBook.quantity,
      bookId : findThisBook.bookId

  }
  const userBuyLater = await addBuyLaterList(buyLaterJSON)
  await deleteThisbookFromUserCart(findThisBook)
  return {message : "this book added to your later list"}


}

async function addWishList(userData) {
    const findWishlistBook = await findThisBookInWishList(userData.body)
    if(findWishlistBook){
        let thisIdIsInDatabase = false
        for(let item in findWishlistBook.userIds){
            if(findWishlistBook.userIds[item] == userData.id){
                thisIdIsInDatabase = true
            }
        }
        if(thisIdIsInDatabase){
          return {message : "this book already in your wishlist"}
        }else{
            findWishlistBook.userIds.push(userData.id)
            await updateWishList({id :findWishlistBook.id , update : findWishlistBook})
        }
       
    }else{
        const wishlistJSON = {
            userIds : [userData.id],
            quantity : userData.body.quantity,
            bookId : userData.body.bookId,
            bookName : userData.body.bookName
        }
        await addWishListThisBook(wishlistJSON)

    }
    return {message : "book was added to a wishlist if any bookstore was added this book, you get notification"}
}

async function addCommentToBooks(commentData) {
  const findUser = await getUserById(commentData.id)
  if(!findUser){
    return {message : "please login add a comment for books"}
  }else{
      const comment = {
          bookId : commentData.body.bookId,
          commentOwnerId : findUser.id,
          commentOwnerUsername : findUser.username,
          commentText : commentData.body.commentText
      }
      const newComment = await newComment
      return {message : "comment added succesfully"}
  }

}






//bookstore funcs
async function createBookStore(bookStoreData) {
  const password = bookStoreData.password
  let bookstoresRegisterInfos = {
    name : bookStoreData.name,
    username : bookStoreData.username,
    email : bookStoreData.email,
    password : "",
    city : bookStoreData.city,
    physcialAddress : bookStoreData.physcialAddress,
    phoneNumber : bookStoreData.phoneNumber
  }
  await hash(password, 10).then(async function(hash) {
    bookstoresRegisterInfos.password = hash
  })
  .catch(e => {
    return {userCreated : false , error : e}
})
  const returnedUser = await addBookStore(bookstoresRegisterInfos)
  if(returnedUser.createdAt){
    return {userCreated : true , returnedUser}
  }else{
    return {userCreated : false ,returnedUser}
  }
}

async function loginBookStore(bookStoreData) {
  let userFilter = {
    username : bookStoreData.username
  }
  const findBookStore = await getBookStoresByField(userFilter)
  console.log(findBookStore)
  if(findBookStore.length < 1){
    return {message : "username or password wrong" , loginAttemp : false}
  }else{

  const comparePassword = await compare(bookStoreData.password,findBookStore[0].password)
        //bool return true or false
        .then(async data => {
          if(data){
              const bookstoreToken = sign(findBookStore[0].id,userSecretKey)
              return {cookie : bookstoreToken , loginAttemp : true}
          }else{
            return {loginAttemp : false}
          }
        })
        .catch(e => {
          return {error : true , code : 500 , message : "compare error" , actualError : e}
        })
        return comparePassword
      }

}


module.exports = { 
  createUser,
  loginUser,
  loginBookStore,
  createBookStore,
  userInfos,
  updateUserInfos,
  buyLaterBook,
  addWishList,
  addCommentToBooks




}
