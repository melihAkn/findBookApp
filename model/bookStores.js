const mongoose = require('mongoose')
const schema = mongoose.Schema

const bookStore = new schema ({
    name :{
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
    city : {
        type : String,
        required : true,
        maxLength : 256
    },
    physcialAddress : {
        type : String,
        required : true,
    },
    bookStoreImages : {
        type : [Object],
        default : [],
        required : false
    }
    
},{collection:'bookStores', timestamps: true})

const bookStoresBook = new schema ({
    bookStoreId : {
        type : String,
        required : true
    },
    bookId : {
        type : String,
        required : true,
    },
    stockInfo : {
        type : Number,
        maxlength : 3,
        default : 0
    },
    price : {
        type : Number,
        default : 0.00
    }

    
},{collection:'bookStoresBook', timestamps: true})

const bookStoresOrder = new schema ({
    
    bookStoreId : {
        type : String,
        required : true,
        unique : false
    },
    purchasingUserId : {
        type : String,
        required : true,
        unique : false
    },
    customerInfos: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phoneNumber : {type : String, required : true},
        address: { type: String, required: true },
    },
    items: [{
        bookName: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        bookISBN: { type: String, required: true }
    }],
    totalAmount: {
        type: Number,
        required: false,
        default : 0
    },
    orderStatus: {
        type: String,
        required : false,
        default: 'Pending'
    },
    orderDate : {
        type : Date,
        required : false,
        default : Date.now
    },
    paymentMethod: {
        type: String,
        required: true
    },
    orderRating : {
        type : String,
        required : false,
        default : 0
    },
    customerNotes : {
        type : String,
        required : false,
        default : ""
    }

},{collection:'bookStoresOrder', timestamps: true})

const bookStoreCart = new schema({
    purchasingBookstoreID : {
        type : String,
        required : true
        
    },
    bookId : {
        type : String,
        required : true,
        unique : true
    },
    sellerBookStoreId : {
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

},{collection : "bookStoresCart",timestamps : true})




const bookStoresBookModel = mongoose.model('bookStoresBook', bookStoresBook,'bookStoresBook')
const bookStoresModel = mongoose.model('bookStores', bookStore,'bookStores')
const bookStoreOrdersModel = mongoose.model('bookStoresOrder',bookStoresOrder,'bookStoresOrder')
const bookStoreCartModel = mongoose.model('bookStoresCart',bookStoreCart,'bookStoreCart')

module.exports = {
    bookStoresBookModel,
    bookStoresModel,
    bookStoreOrdersModel,
    bookStoreCartModel
}
