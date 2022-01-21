const router = require('express').Router()
const User = require("../Model/User")
const bcrypt = require('bcrypt');

//register new user
router.post("/register",async (req,res)=>{
    try{
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(req.body.password,salt)
        const newUser = await new User({
            username:req.body.username,
            email:req.body.email,
            password:hashPassword
        })
    
        const user = await newUser.save()
        res.status(201).json(user)
    }catch(err){
        res.status(500).json(err)
    }
})

//login
router.post("/login",async (req,res)=>{
    try{
        const user = await User.findOne({email:req.body.email});
        if (!user)
        { 
            res.status(404).json("User not found");
            return;
        }

        const validPassword = await bcrypt.compare(req.body.password,user.password)
        if (!validPassword)
        {
            res.status(400).json("Wrong password");
            return;
        }
        
        res.status(200).json(user)
    }catch(err){
        res.status(500).json(err)
    }
})

module.exports = router