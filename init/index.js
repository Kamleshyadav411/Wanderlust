const mongoose = require("mongoose");
const initdata=require("./data.js");
const Listing= require("../models/listing.js");

const MONGO_URL='mongodb://127.0.0.1:27017/wanderlust';


main()
.then(() =>{
    console.log("connected to DB");
   })
  .catch((err)=>{
    console.log(err);
   });

async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB = async() =>{
    await Listing.deleteMany({});
   initdata.data= initdata.data.map((obj) =>({...obj, owner: "64f0c1b2d4f8e3a1c8b4e5f6"})); // Replace with actual user ID 
    await Listing.insertMany(initdata.data);
    console.log("data was initialized");
};

initDB();