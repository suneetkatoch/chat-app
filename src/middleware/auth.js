const jwt=require("jsonwebtoken");
const usercol=require("../models/registers");

const auth=async (req,res,next)=>{
    try {
        const token=req.cookies.jwt;
        const verify=jwt.verify(token,"mynameissuneetkatochandiamfrompalampurkangrahimachal");
        
        const user= await usercol.findOne({_id:verify._id})
        

        req.token=token;
        req.user=user;

        next();
    } catch (err) {
        res.status(401).send(err);
        
    }
    
    

}
module.exports=auth;
