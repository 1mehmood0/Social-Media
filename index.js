const express=require("express");
const app=express();
const mongoose=require("mongoose");
const dotenv=require("dotenv");
const helmet=require("helmet");
const morgan=require("morgan");

const userRoute=require("./routes/user");
const authRoute=require("./routes/auth");
const postRoute=require("./routes/post");

dotenv.config();

mongoose.connect(process.env.ATLAS_URL,()=>{
    console.log("Database Connected");
})

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/api/users",userRoute);
app.use("/api/auth",authRoute);
app.use("/api/posts",postRoute);


app.get("/",(req,res)=>{
    res.send("Welcome to home page");
})
app.get("/users",(req,res)=>{
    res.send("Welcome to Users page");
})




app.listen(8080,()=>{
    console.log("Backend is Running");
})