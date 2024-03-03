const mongoose = require('mongoose');
const schema = mongoose.Schema;

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
    
},{collection:'bookStores', timestamps: true});

const bookStoresBook = new schema ({
    bookStoreId : {
        type : String,
        required : true,
    },
    bookId : {
        type : String,
        required : true
    },
    stockInfo : {
        type : Number,
        maxlength : 3,
        default : 0
    },
    price : {
        type : Number,
        default : 0.00
    },

    
},{collection:'bookStoresBook', timestamps: true});

const bookStoresBookModel = mongoose.model('bookStoresBook', bookStoresBook,'bookStoresBook');
const bookStoresModel = mongoose.model('bookStores', bookStore,'bookStores');



module.exports = {
    bookStoresBookModel,
    bookStoresModel
};
