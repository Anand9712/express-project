const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username:{
        type : String,
        required : [true, "please register the user"],
    },
    email:{
        type : String,
        required : [true, "please add user email address"],
        unique : [true,"Email is already registered"],
    },
    password:{
        type : String,
        required : [true, "please add contact phone"],
    },

},{
    timestamps:true,
});

module.exports=mongoose.model("user",userSchema);