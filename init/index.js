const mongoose = require("mongoose")

const data = require("./data.js")
const Listing = require("../models/listing.js")

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
}

main()
.then(()=>{
    console.log("connected to db")
})
.catch(err=>{
    console.log(err)
})

const initDB = async () => {
  await  Listing.deleteMany({})
  await Listing.insertMany(data.initDATA)
  console.log("data inserted into DB")
}

initDB();
