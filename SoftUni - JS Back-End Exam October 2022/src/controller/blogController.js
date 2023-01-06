const router = require('express').Router();

const blogServices = require('../services/blogServices');
const { isAuth } = require('../middlewares/authMiddleware');
const User = require('../models/User')


function getErrorMessage(error) {
    let errorsArr = Object.keys(error.errors);

    if (errorsArr.length > 0) {
        return error.errors[errorsArr[0]];
    } else {
        return error.message
    }

}

async function isOwner(req, res, next) {
    let blog = await blogServices.getOne(req.params.blogId);

    if (blog.owner == req.user._id) {
        res.redirect(`/blog/${req.params.blogId}/details`);
    } else {
        next();
    }
}

async function checkIsOwner(req, res, next) {
    let blog = await blogServices.getOne(req.params.blogId);

    if (blog.owner == req.user._id) {
        next();
    } else {
        res.redirect(`/blog/${req.params.blogId}/details`);
    }
}

router.get('/catalog', async (req, res) => {
    let blog = await blogServices.getAll();
    res.render('blog/catalog', { title: 'All Blogs', blog});
});


router.get('/create', isAuth, (req, res) => {
    res.render('blog/create', { title: 'Create blog' });
});

router.post('/create', isAuth, async (req, res) => {
    try {
        await blogServices.create({ ...req.body, owner: req.user._id });
        res.redirect('/blog/catalog');
    } catch (error) {
        res.render('blog/create', { error: getErrorMessage(error)})
    }
    
});

router.get('/:blogId/details', async (req, res) => {
    let blog = await blogServices.getOne(req.params.blogId);
    let blogData = blog.toObject();
    let isOwner = blogData.owner == req.user?._id;
    let owner = await User.findById(blogData.owner);
    let following = blogData.followers;
    
    let followingEmailsArr = [];
    for(let id of following){
        let user = await User.findById(id);
        followingEmailsArr.push(user.email);
    }
    let followingEmails = followingEmailsArr.join(", ")

    let isFollowing = req.user && following.some(c => c._id == req.user?._id);

    res.render('blog/details', { ...blogData, isOwner, isFollowing, followingEmails, ownerEmail: owner.email });
});

router.get('/:blogId/follow', isOwner, async (req, res) => {
    const blogId = req.params.blogId
    let blog = await blogServices.getOne(blogId);

    blog.followers.push(req.user._id);
    await blog.save();
    res.redirect(`/blog/${req.params.blogId}/details`);
});

router.get('/:blogId/edit', checkIsOwner, async (req, res) => {
    const blogId = req.params.blogId
    
    let blog = await blogServices.getOne(blogId);
    res.render('blog/edit', { ...blog.toObject() })
    
});

router.post('/:blogId/edit', checkIsOwner, async (req, res) => {
    try {
        const blogId = req.params.blogId;
        const blogData = req.body;
        await blogServices.update(blogId, blogData);
        res.redirect(`/blog/${blogId}/details`);
    } catch (error) {
        res.render('blog/edit', { error: getErrorMessage(error)})
    }
    
});

router.get('/:blogId/delete', checkIsOwner, async (req, res) => {
    const blogId = req.params.blogId;
    await blogServices.delete(blogId);
    res.redirect('/blog/catalog');
})

module.exports = router;