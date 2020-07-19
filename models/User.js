const {Schema, model, Types} = require('mongoose')

// fields for User:
const schema = new Schema({
email:{type:String, required:true, unique:true},
password: {type:String, required:true},
    links:[{type:Types.ObjectId, ref:'Link'}]  //ref -  к какой коллекции привязываемся?
})
module.exports=model('User', schema)