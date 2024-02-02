const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const date = new Date();
const day = date.toLocaleDateString();

// var items = ["WakeUp","BreakFast","Lunch"];

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.set('view engine','ejs');
mongoose.connect("mongodb://127.0.0.1:27017/todolistDB");

const itemsSchema = new mongoose.Schema({
    name: String
});

const Item = mongoose.model("Item",itemsSchema)

const item1 = new Item({ name: "Gym" })

const item2 = new Item({ name: "Breakfast" })

const item3 = new Item({ name: "Code" })

const defaultItems = [item1, item2, item3];

const listSchema = mongoose.Schema({
    name: String,
    items: [itemsSchema]
})

const List = mongoose.model("List",listSchema);


 

app.get("/",function(req,res)
{   
    Item.find({}).then(foundItems=>{
        if(foundItems.length === 0)
        {
            Item.insertMany(defaultItems).then(resu=>{
            console.log("Successfully Inserted default Items to db")
        }).catch(error=>{ 
         console.log(error);
        });
        res.redirect("/")

        }
        else
        {

            res.render("list",{listTitle: day , itemsArr: foundItems});

        }

    }).catch(error=>{
        console.log(error);
    })
})


app.post("/",(req,res)=>{
    const item = new Item({name: req.body.newItem});
    const listName = req.body.list;

        item.save();
        res.redirect("/")
   
})

app.post("/delete",async (req,res)=>{
    const delItem = req.body.checkedItem;
    const listName = req.body.listName;

    
        await Item.findByIdAndDelete(delItem).exec();
        res.redirect("/")
   
})


app.listen(3000,function()
{
    console.log("Server started at 3000");
});