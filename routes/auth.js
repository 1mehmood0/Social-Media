const router=require("express").Router();
const User=require("../models/users");
const bcrypt=require("bcrypt");

//REGISTER

router.post("/register",async(req,res)=>{
    try{
        //generate new hashed password
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(req.body.password,salt);
        
        //create new user
        const user=await new User({
            username:req.body.username,
            email:req.body.email,
            password:hashedPassword
        });
        //saving user
    const savedUser=await user.save();
    res.status(200).send(savedUser);
    }
    catch(err){
        res.status(500).send(e);
    }
})


//LOGIN
router.post("/login",async(req,res)=>{
try{    
    const userData=await User.findOne({email:req.body.email});
    if(userData){
        const dehashedPassword=await bcrypt.compare(req.body.password,userData.password);
        if(!dehashedPassword){
            res.status(400).send("invalid Password");
        }
        else{
            res.status(201).send(userData);
        }
    }
    else{
        res.status(404).send("User not found");
    }
}
catch(e){
    res.status(500).send(e);
}
})
module.exports=router;