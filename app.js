const express = require("express")
const app = express()
const path = require("path")
const mongoose = require("mongoose")
const port = 8080
const Listing = require("./models/listing.js")
const methodOverride = require("method-override")
const ejsMate = require('ejs-mate')
const wrapAsync = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/ExpressError.js")
const listingSchema = require("./schema.js")

app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views"))

app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"))
app.use(express.static(path.join(__dirname,"/public")))
app.engine("ejs", ejsMate)



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

app.listen(port,()=>{
    console.log(`listening to port ${port}`)
})


const validateListing = (req,res,next) =>{
    let {error} = listingSchema.validate(req.body)
    if(error){
        throw new ExpressError(400,error);
    }else{
        next();
    }
}

app.get("/",(req,res)=>{
    res.redirect("/listings")
})

//to show all the listings
app.get("/listings",wrapAsync (async (req,res)=>{
   const allListings =  await Listing.find()
   
   res.render("listings/index.ejs",{allListings})
}))


// to create new listing
app.get("/listings/new",(req,res)=>{
   
    res.render("listings/new.ejs")
})


//toStore new listing in DB
app.post("/listings",wrapAsync( async (req,res)=>{
        if(!req.body.listing){
            throw new ExpressError(400,"sent valid data for listing")
        }
        const addNew = new Listing(req.body.listing)
        await addNew.save()
        res.redirect("/listings")
    })
)


//edit and Update listings
//edit
app.get("/listings/:id/edit",wrapAsync(async (req,res)=>{
    let {id} = req.params
    let list = await Listing.findById(id)
    res.render("listings/edit.ejs",{list})
}))

//Update
app.put("/listings/:id",wrapAsync(async (req,res)=>{
    if(!req.body.listing){
        throw new ExpressError(400,"sent valid data for listing")
    }
    let {id} = req.params
   await Listing.findByIdAndUpdate(id,{...req.body.listing})
   res.redirect(`/listings/${id}`)
}))


//delete listing
app.delete("/listings/:id",wrapAsync (async (req,res)=>{
    let {id} = req.params
    let deleted = await Listing.findByIdAndDelete(id) 
    console.log(deleted)
    res.redirect("/listings")
}))


//to show a particular listing
app.get("/listings/:id",wrapAsync (async (req,res)=>{
    const {id} = req.params
    let  list = await Listing.findById(id)
    
    res.render("listings/show.ejs",{list})
}))

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found"))
})

app.use((err,req,res,next)=>{
    let {statusCode = 400,message} = err
    
    res.status(statusCode).render("error.ejs",{message})
})


// app.get("/listings", async (req,res)=>{
//     let sampleListing = new Listing({
//         title: "La Penzo",
//         description: "Za Best",
//         price : 1200,
//         location : "simla"
//     })

//     await sampleListing.save()
//     console.log("Sample was saved ")
//     res.send("Successful")
// })