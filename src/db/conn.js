const mongoose=require("mongoose");

mongoose.connect("mongodb+srv://suneetkatoch:Suneet123@cluster0.cskfz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority").then(()=>{
    console.log("connected successfully")
}).catch((err)=>{
    console.log(err);
})


