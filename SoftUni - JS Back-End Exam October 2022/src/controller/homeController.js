const router = require('express').Router();

const { isAuth } = require('../middlewares/authMiddleware');
const blogServices = require('../services/blogServices')

router.get('/', async (req, res) => {
    const blogs = await blogServices.getAll();
    let lastThree

    if (blogs.length > 3) {
        lastThree = blogs.slice(-3);
    }else{
        lastThree = blogs;
    }

    res.render('home/home', { lastThree });
});


module.exports = router;