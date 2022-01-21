const router = require('express').Router()
const Post = require("../Model/Post");
const User = require('../Model/User');

//create a post
router.post("/", async(req,res)=>{
    const post = await new Post(req.body)
    try{
        const savedPost = await post.save();
        res.status(201).json(savedPost)
    }catch(err){
        res.status(500).json(err)
    }
})
//update a post
router.put("/:id", async(req,res)=>{
    try {
        const post =  await Post.findById(req.params.id)
        if(post.userId === req.body.userId){
           await post.updateOne({$set:req.body})
           res.status(200).json("Your post has been updated")
        }
        else{
            res.status(403).json("You can only update your post")
        }
    } catch (err) {
        res.status(500).json(err)
        return;
    }
})
//delete a post
router.delete("/:id", async(req,res)=>{
    try {
        const post =  await Post.findById(req.params.id)
        if(post){
            if(post.userId === req.body.userId){
            await post.deleteOne({$set:req.body})
            res.status(200).json("Your post has been deleted")
            }
            else{
                res.status(403).json("You can only delete your post")
            }
        }
        else{
            res.status(403).json("No such posts found")
        }
    } catch (err) {
        res.status(500).json(err)
        return;
    }
})
//like | dislike
router.put("/:id/like", async(req,res)=>{
    try {
        const post =  await Post.findById(req.params.id)
        if(!post.likes.includes(req.body.userId)){
            await post.updateOne({$push:{likes:req.body.userId}})
            res.status(200).json("You have liked the post")
            return;
        }
        else{
            await post.updateOne({$pull:{likes:req.body.userId}})
            res.status(200).json("You have disliked the post")
            return;
        }
    } catch (err) {
        res.status(500).json(err)
        return;
    }
})
//get a post
router.get("/:id", async(req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
        return;
    } catch (err) {
        res.status(500).json(err)
    }
})
//get timeline
router.get("/:id/timeline", async(req,res)=>{
    try{
        const userPosts = await Post.find({userId:req.body.userId})
        const currUser = await User.findById(req.body.userId)
        const friendPosts = await Promise.all(
            currUser.followings.map(friendId => {
                return Post.find({userId:friendId});
            })
        )
        res.status(200).json(userPosts.concat(...friendPosts))
        return;
    }catch(err){
        res.status(500).json(err)
        return;
    }
})


module.exports = router