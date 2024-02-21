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
        
    }
    
},{collection:'bookStores', timestamps: true});

const bookStores = mongoose.model('Books', bookStore);
module.exports = bookStores;