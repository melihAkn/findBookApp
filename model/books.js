const mongoose = require('mongoose');
const schema = mongoose.Schema;

const book = new schema ({
    name :{
        type : String,
        required : true,
        maxLength : 255,
        minLength : 1
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
    genre : {
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
    },
    images : {
        type : [Array],
        required : false,
        default : []
    },
    stockInfo : {
        type : [Object],
        required : false,
        default : [],

    }
    
},{collection:'book', timestamps: true});

const books = mongoose.model('Books', book);
module.exports = books;