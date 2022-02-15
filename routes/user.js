const router=require("express").Router();
const bcrypt=require("bcrypt");
const User=require("../models/users");

//UPDATE user
router.put("/:id",async(req,res)=>{
    try{
        if(req.body.userId===req.params.id||req.body.isAdmin)
        {
            if(req.body.password){
                try{
                    const salt=await bcrypt.genSalt(10);
                    req.body.password=await bcrypt.hash(req.body.password,salt);
                }
                catch(e)
                {
                    res.status(500).send(e);
                }
            }
                try{ //set alll updated data into the body
                    const user=await User.findByIdAndUpdate(req.params.id,{$set:req.body});
                    res.status(200).send("Account has been updated");
                }
                catch(e){
                    res.status(500).send(e);
                }
            
        }
        else
        {
            return res.status(403).send("Can update only your account");
        }
    }
    catch(e){
        res.status(500).send(e);
    }
});


//DELETE
router.delete("/:id",async(req,res)=>{
    try{
        if(req.body.userId===req.params.id||req.body.isAdmin)
        {
                try{ //set alll updated data into the body
                    const user=await User.findOneAndDelete(req.params.id);
                    res.status(200).send("Account has been Deleted");
                }
                catch(e){
                    res.status(500).send(e);
                } 
        }
        else
        {
            return res.status(403).send("Can Delete only your account");
        }
    }
    catch(e){
        res.status(500).send("Enter correct userId");
    }
});

//GET A USER
router.get("/:id",async(req,res)=>{
    try{
        const user=await User.findById(req.params.id);
        const {password,updatedAt,...other}=user._doc;
        res.status(200).send(other);
    }catch(e)
    {
        res.status(404).send("User not Found");
    }
})

//FOLLOW A USER
router.put("/:id/follow",async(req,res)=>{
    if(req.body.userId!==req.params.id)
    {
        try{
            const userTobeFollowed=await User.findById(req.params.id);
            const currUser=await User.findById(req.body.userId);
           if(!userTobeFollowed.followers.includes(req.body.userId))
           {
                await userTobeFollowed.updateOne({$push:{followers:req.body.userId}});
                await currUser.updateOne({$push:{following:req.params.id}});
                res.status(200).send("User has been followed");
           }
           else{
               res.status(403).send("You are already following the user")
           }
            
        }catch(e){
            res.status(500).send(e);
        }

    }else{
        res.status(403).send("You cant follow yourself");
    }
})


//UNFOLLOW A USER
router.put("/:id/unfollow",async(req,res)=>{
    if(req.body.userId!==req.params.id)
    {
        try{
            const userTobeUnfollowed=await User.findById(req.params.id);
            const currUser=await User.findById(req.body.userId);
           if(!userTobeUnfollowed.followers.includes(req.body.userId))
           {
            res.status(403).send("You have already unfollowed the user")
           }
           else{
               
               await userTobeUnfollowed.updateOne({$pull:{followers:req.body.userId}});
                await currUser.updateOne({$pull:{following:req.params.id}});
                res.status(200).send("User has been Unfollowed");
           }
            
        }catch(e){
            res.status(500).send(e);
        }

    }else{
        res.status(403).send("You cant unfollow yourself");
    }
})

module.exports=router;