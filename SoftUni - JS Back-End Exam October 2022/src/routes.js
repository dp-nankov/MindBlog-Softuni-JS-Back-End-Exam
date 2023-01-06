const router = require('express').Router();

const homeController = require('./controller/homeController');
const authController = require('./controller/authController');
const blogController = require('./controller/blogController');
const profileController =require('./controller/profileController');

router.use('/', homeController);
router.use('/auth', authController);
router.use('/blog', blogController);
router.use('/profile', profileController);
router.get('/*', (req, res) => {
    res.render('404');
})

module.exports = router;