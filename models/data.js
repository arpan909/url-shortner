const mongoose = require('mongoose');
const validator= require('validator');


const Data=mongoose.model("Data",{

    alias:{
        type:String,
        unique:true,
        lowercase:true,
        trim:true
    },
    url:{
        type:String,
        required:true,
        lowercase:true,
        trim:true,
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Not a valid URL");
            }
        }
    }

});

module.exports=Data;