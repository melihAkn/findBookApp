const mongoose = require('mongoose')
const schema = mongoose.Schema

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
        minLength : 10,
        required : true,
        unique : true
    },
    images : [{
        path: String,
        index: Number,
        _id : false
    }],
    isValidBook : {
        type : Boolean,
        required : true,
        default : false,
    }
    
},{collection:'books', timestamps: true})


const bookComments = new schema ({
    bookId : {
        type : String,
        required : true,
        unique : false
    },
    commentOwnerId : {
        type : String,
        required : true,
        unique : false
    },
    commentOwnerUsername : {
        type : String,
        required : true,
        unique : false
    },
    commentText : {
        type : String,
        required : true
    },
    yesCount : {
      type : Number,
      required : false,
      default : 0,  
    },
    noCount : {
        type : Number,
        required : false,
        default : 0,
    },

},{collection : 'bookComments' , timestamps : true})


const bookSellInfos = new schema ({
    bookId : {
        type : String,
        required : true
    },
    bookCity : {
        type : String,
        required : true
    },
    sellCount : {
        type : Number,
        required : false,
        default : 0
    },
    bookCategory : {
        type : String,
        required : true
    }

},{collection : "bookSellInfos" , timestamps : true})

const bookModel = mongoose.model('books', books,'books')
const bookCommentsModel = mongoose.model('bookComments',bookComments,'bookComments')
const bookSellInfosModel = mongoose.model('bookSellInfos',bookSellInfos,'bookSellInfos')
module.exports = {
    bookModel,
    bookCommentsModel,
    bookSellInfosModel
}
