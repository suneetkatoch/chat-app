const mongoose=require("mongoose");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const res = require("express/lib/response");

const userschema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        
    },
    age:{
        type:Number,
        required:true,
       
    },
    phone:{
        type:Number,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    tokens:[{
        token:{
            type:String,
            required:true

        }

    }]

})
//generating token
userschema.methods.generateAuthToken= async function(){
    try{
        const tokend=await jwt.sign({_id:this._id},"mynameissuneetkatochandiamfrompalampurkangrahimachal")
        this.tokens=this.tokens.concat({token:tokend});
        await this.save();
        return tokend;
    }catch(err){
        res.send(`the rrort is${err}`);
        console.log(`the rrort is${err}`);

    }
}
//converting password to hash
userschema.pre("save", async function(next){
    if(this.isModified("password"))
    {
        this.password=await bcrypt.hash(this.password,10);

    }
    
    next();

});

const Usercol=new mongoose.model("Usercol",userschema);

module.exports=Usercol;