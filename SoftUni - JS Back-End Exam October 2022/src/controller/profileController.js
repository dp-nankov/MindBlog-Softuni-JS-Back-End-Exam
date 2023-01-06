const router = require('express').Router();

const { isAuth } = require('../middlewares/authMiddleware');
const blogServices = require('../services/blogServices')
const User = require('../models/User')

router.get('/', async (req, res) => {
    const userId = req.user._id;
    const user = await User.findById(userId);
    const blogs = await blogServices.getAll();
    const followedBlogs = [];
    const ownedBlogs = await blogServices.getOwned(userId);
   

    for(let blog of blogs){
        let following = blog.followers;
        let isFollowing = req.user && following.some(c => c._id == req.user?._id);
        if(isFollowing){
            followedBlogs.push(blog);
        }
    }
    const ownedBlogsCount = ownedBlogs.length;
    const followedBlogsCount = followedBlogs.length;

    res.render('profile', { userEmail: user.email, ownedBlogs, followedBlogs, ownedBlogsCount, followedBlogsCount });
});


module.exports = router;