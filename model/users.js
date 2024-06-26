const mongoose = require('mongoose')
const schema = mongoose.Schema

const user = new schema ({
    nameAndSurname :{
        type : String,
        required : true,
        maxLength : 255,
        minLength : 1
    },
    username : {
        type : String,
        required : true,
        maxLength : 256,
        minlength : 5
    },
    email : {
        type : String,
        minlength : 5,
        maxLength : 256,
        required : true
    },
    password : {
        type : String,
        requrired : true,
        maxLength : 255,
        minLength : 8,
    },
    phoneNumber : {
        type : String,
        required : true,
        maxLength : 12,
        minlength : 1
    },
    favoritedBooks : {
        type : [Object],
        default : [],
        required : false
    },
    city : {
        type : String,
        required : true
    },
    physcialAddress : {
        type : String,
        required : false,
        default : ""
    }
    
},{collection:'users', timestamps: true})

const userShoppingCard = new schema ({
    userId : {
        type : String,
        required : true
        
    },
    bookId : {
        type : String,
        required : true,
    },
    bookStoreId : {
        type : String,
        required : true,
    },
    bookPrice : {
        type : String,
        required : true
    },
    quantity : {
        type : Number,
        required : true,
        default : 1
    },
    bookName : {
        type : String,
        required :true,

    }
    
},{collection:'userShoppingCard', timestamps: true})

const userFavoritedBooks = new schema ({
    userId : {
        type : String,
        required : true
        
    },
    bookId : {
        type : String,
        required : true
    }
    
},{collection:'userFavoritedBooks', timestamps: true})

const userBuyLaterList = new schema ({
    userId : {
        type : String,
        required : true,
        unique : false
    },
    quantity : {
        type : Number,
        required : true,
        unique : false
    },
    bookId : {
        type : String,
        required : true,
        unique : true
    }
},{collection:'userBuyLaterList', timestamps: true})

const userWishList = new schema ({

    userIds : {
        type : [String],
        required : true,
        default : []
    },
    quantity : {
        type : Number,
        required : true,
        unique : false
    },
    bookId : {
        type : String,
        required : true,
        unique : true
    },
    bookName : {
        type : String,
        required : true,

    }
},{collection:'userWishList', timestamps: true})
const userFavBooksModel = mongoose.model('userFavBooks', userFavoritedBooks,'userFavoritedBooks')
const userCartModel = mongoose.model('userShoppingCard', userShoppingCard,'userShoppingCard')
const usersModel = mongoose.model('users', user,'users')
const userBuyLaterModel = mongoose.model('userBuyLater',userBuyLaterList,'userBuyLaterList')
const userWishListModel = mongoose.model('userWishList',userWishList,'userWishList')
module.exports = {
    userFavBooksModel,
    userCartModel,
    usersModel,
    userBuyLaterModel,
    userWishListModel
}