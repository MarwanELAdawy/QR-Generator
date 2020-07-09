var mongoose = require('mongoose');
var userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    phone:{
        type:Number
    }
});

module.exports = mongoose.model('user', userSchema);