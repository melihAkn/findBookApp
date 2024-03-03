const mongoose = require('mongoose');
const schema = mongoose.Schema;

const contact = new schema ({
    name : {
        type : String,
        required : true,
        minLength : 3,
        maxlength : 100
    },
    email : {
        type : String,
        required : true,
        minLength : 3,
        maxlength : 100
    },
    message : {
        type : String,
        required : true,
        minLength : 1,
        maxlength : 256
    }
    
},{collection:'contact', timestamps: true});

const contacts = mongoose.model('contacts', contact,'contact');
module.exports = contacts;