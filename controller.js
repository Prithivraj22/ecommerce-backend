const { User, SearchHistory, Item, Cart } = require("./models");
const {Suprsend,Workflow} = require("@suprsend/node-sdk");
const crypto=require('crypto')

const supr_client = new Suprsend("3BQAluJ5w24iwFgy88IE", "SS.WSS.BMNCVxzQL2u5tVVIX2ed2-6ebmG91FF3Klr2qb8K");

exports.getItems = async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

exports.createItem = async (req, res) => {
  try {
    const { name, image, description } = req.body;
    const newItem = new Item({ name, image, description });
    await newItem.save();
    res.status(201).json({ message: "Item created successfully", item: newItem });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

exports.addToCart = async (req, res) => {
  console.log("add",req.body)
  
 try{
  const cart=await Cart(req.body);
  const Workflow_body={
    "name":'message_workflow',
    "template":"message",
    "notification_category":"transactional",
    "users":[{
        "distinct_id":req.body.user

    }],
    "data":{
        "from":"PrimeDeals",
        "message":'Item added to cart',
    }
}
const workflow = new Workflow(Workflow_body,{});
const resp=supr_client.trigger_workflow(workflow);
console.log(resp)
  cart.save()
  console.log(cart)
 }
 catch(err)
 {
  console.log(err)
 }
};

exports.removeFromCart = async (req, res) => {
  try {
    console.log("k",res)
    // const userId = req.params.user;
    const Workflow_body={
      "name":'message_workflow',
      "template":"message",
      "notification_category":"transactional",
      "users":[{
          "distinct_id":req.params.user
  
      }],
      "data":{
          "from":"PrimeDeals",
          "message":'Item removed from cart',
      }
    }
    const workflow = new Workflow(Workflow_body,{});
    const resp=supr_client.trigger_workflow(workflow);
    console.log(resp)
    // console.log(`Removing item with ID ${itemId} from user ${userId}'s cart`);
    console.log("asdfghjkl",req.params.user,req.body.id)

    const cart = await Cart.findOneAndDelete({ user:req.params.user,_id:req.body.id});
   

    console.log('deleted',cart);
  
  }
  catch(err)
  {
    console.log(err)
  }
};

exports.getCart = async (req, res) => {
  console.log("cart db",req.params.user)
  try {
    console.log("s")
    const cart = await Cart.find({user:req.params.user})
    console.log(cart)
    res.send(cart)
   
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

exports.getUsers = async (req, res) => {
  try {
    const data = await User.find({});
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

exports.createUsers = async (req, res) => {
  try {
    const { userName, password } = req.body;
    // Check if user already exists
    const existingUser = await User.findOne({ userName });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }
    const newUser = new User({ userName, password });
    await newUser.save();
    const user = supr_client.user.get_instance(userName); 
    const response = user.save() // IMP: trigger request
response.then((res) => console.log("response", res));


response.then((res) => console.log("response", res));
    res.status(201).json({ message: "Signup successful", user: newUser });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      // Handle duplicate key error
      res.status(400).json({ message: "Username already exists" });
    } else {
      res.status(500).send("Internal Server Error");
    }
  }
};

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ userName: req.body.userName, password: req.body.password });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    const hash = crypto
    .createHmac("sha256", "0ev10GzNiqoW8t68RWyWNQw5Dc9_LFs71vPDxtCk_G4")
    .update(req.body.userName)
    .digest("base64url");
  const sub=hash.trimEnd("=");
  console.log("subs",sub)

  const Workflow_body={
    "name":'message_workflow',
    "template":"message",
    "notification_category":"transactional",
    "users":[{
        "distinct_id":user.userName

    }],
    "data":{
        "from":"PrimeDeals",
        "message":`Welcome back ${user.userName} `,
        
    }
}
const workflow = new Workflow(Workflow_body,{});
const resp=supr_client.trigger_workflow(workflow);
    res.status(200).json({ message: "Login successful", user ,sub:sub});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.createSearchHistory = async (req, res) => {
  try {
    const { query } = req.body;
    const newSearch = new SearchHistory({ query });
    await newSearch.save();
    res.status(201).json(newSearch);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

exports.getSearchHistoryList = async (req, res) => {
  try {
    const historyList = await SearchHistory.find().sort({ timestamp: -1 }).limit(10);
    res.status(200).json(historyList);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getSubscriberid = async(req,res)=>{
  try{

  }catch(err){

  }
};