const router=require("express").Router();
const Post=require("../models/posts");


//CREATE
router.post("/",async(req,res)=>{
    const newPost=await new Post(req.body);
    try{
        const savedPost=await newPost.save();
        res.send(200).send(savedPost);
    }
    catch(err)
    {
        res.status(500).send(err);
    }
})

module.exports=router;