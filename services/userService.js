const { addUser, getUsersByField, getUserById, updateUser, deleteUser } = require('../repositories/userRepository')
const { addBookStore, getBookstoresById, getBookStoresByField } = require('../repositories/bookStoreRepository')
const { hash , compare } = require('bcrypt')
const {sign,verify} = require('jsonwebtoken')
const userSecretKey = process.env.JWT_USER_SECRET_KEY

//user funcs
async function createUser(userData) {
    const password = userData.password
    let userRegisterInfos = {
      nameAndSurname : userData.nameAndSurname,
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


module.exports = { createUser, loginUser ,loginBookStore, createBookStore }
