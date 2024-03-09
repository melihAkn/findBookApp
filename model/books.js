const mongoose = require('mongoose');
const schema = mongoose.Schema;

const books = new schema ({
    name :{
        type : String,
        required : true,
        maxLength : 255,
        minLength : 1,
    },
    description : {
        type : String,
        required : true,
        maxLength : 256,
        minLength : 1
    },
    pageCount : {
        type : Number,
        maxValue : 2000,
        minValue : 1,
        required : true,
    },
    category : {
        type : String,
        required : true,
        maxLength : 256,
        minLength : 1
    },
    averageRating : {
        type : Number,
        required : true,
        maxValue : 5,
        minValue : 0
    },
    publicationDate : {
        type : String,
        required : true
    },
    author : {
        type : String,
        required : true,
        maxLength : 256,
        minLength : 1
    },
    ISBN : {
        type : String,
        maxLength : 13,
        minLength : 11,
        required : true,
        unique : true
    },
    images : {
        type : [Array],
        required : false,
        default : []
    },
    isValidBook : {
        type : Boolean,
        required : true,
        default : false,
    }
    
},{collection:'books', timestamps: true});

const bookModel = mongoose.model('books', books,'books');
module.exports = {
    bookModel

};
