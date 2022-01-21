const { findById } = require('../Model/User')
const bcrypt = require('bcrypt')
const User = require('../Model/User')

const router = require('express').Router()

//update user
router.put("/:id", async(req,res) =>{
    try{
        if(req.body.userId === req.params.id || req.body.isAdmin){
            if(req.body.password){
                try{
                    const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password,salt);
                }catch(err){
                    res.status(500).json(err);
                    return;
                } 
            }
            try{
                const user = await User.findByIdAndUpdate(req.params.id,{
                    $set:req.body,
                });
                res.status(200).json("Account has been updated");
                return;                
            }catch(err){
                res.status(500).json(err);
                return;
            }
        }
        else{
            res.status(403).json("You can only update your account!")
        }
    }catch(err){
        res.status(500).json(err)
    }
    
})

//delete user
router.delete("/:id", async(req,res) =>{
    try{
        if(req.body.userId === req.params.id || req.body.isAdmin){
            try{
                await User.findByIdAndDelete(req.params.id);
                res.status(200).json("User has been deleted");
                return;                
            }catch(err){
                res.status(500).json(err);
                return;
            }
        }
        else{
            res.status(403).json("You can only delete your account!")
        }
    }catch(err){
        res.status(500).json(err)
    }
    
})
//get a user
router.get("/:id", async(req,res) =>{
    try{
        const user = await User.findById(req.params.id);
        const {password, updatedAt, ...details} = user._doc;
        res.status(200).json(details)
    }catch(err){
        res.status(500).json(err)
    }   
})

//follow a user
router.put("/:id/follow", async(req,res)=>{
    try{
        if(req.params.id !== req.body.userId){
            try{
                const searchUser = await User.findById(req.params.id)
                const currUser = await User.findById(req.body.userId)
                if(!searchUser.followers.includes(req.body.userId)){
                   await searchUser.updateOne({$push:{followers:req.body.userId}})
                   await currUser.updateOne({$push:{followings:req.params.id}})
                   res.status(200).json("You followed this user")
                   return;
                }
                else{
                    res.status(403).json("You already follow this user");
                    return;
                }
            }catch(err){
                res.status(500).json(err)
            }
        }
        else{
            res.status(403).json("You cannot follow yourself");
            return;
        }
        
    }catch(err){
        res.status(500).json(err)
    }
})

//unfollow a user
router.put("/:id/unfollow", async(req,res)=>{
    try{
        if(req.params.id !== req.body.userId){
            try{
                const searchUser = await User.findById(req.params.id)
                const currUser = await User.findById(req.body.userId)
                if(searchUser.followers.includes(req.body.userId)){
                   await searchUser.updateOne({$pull:{followers:req.body.userId}})
                   await currUser.updateOne({$pull:{followings:req.params.id}})
                   res.status(200).json("You unfollowed this user");
                   return;
                }
                else{
                    res.status(403).json("You dont follow this user");
                    return;
                }
            }catch(err){
                res.status(500).json(err)
            }
        }
        else{
            res.status(403).json("You cannot unfollow yourself");
            return;
        }
        
    }catch(err){
        res.status(500).json(err)
    }
})

module.exports = router