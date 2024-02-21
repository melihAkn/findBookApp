const mongoose = require('mongoose');
const schema = mongoose.Schema;

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
    cart : {
        type : [Object],
        required : false,
        default : []
    },
    physcialAddress : {
        type : String,
        required : false,
        default : ""
    }
    
},{collection:'users', timestamps: true});

const users = mongoose.model('Books', user);
module.exports = users;