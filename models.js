
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const authSchema = new Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const historySchema = new Schema({
  query: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});


const itemSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});


const cartSchema = new Schema({
  user:{type:String,required:true},
  items:{
    type:Object,

  }
 ,
 quantity:{type:Number}
  
});

const User = mongoose.model("User", authSchema);
const SearchHistory = mongoose.model("SearchHistory", historySchema);
const Item = mongoose.model("Item", itemSchema);
const Cart = mongoose.model("Cart", cartSchema);

module.exports = { User, SearchHistory, Item, Cart };
