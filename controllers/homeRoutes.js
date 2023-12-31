const router = require('express').Router();
const { Post, User, Category } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
  try {
    // Get all posts and JOIN with user data
    const postData = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });

    // Serialize data so the template can read it
    const posts = postData.map((post) => post.get({ plain: true }));
    // Pass serialized data and session flag into template
    res.render('login', { 
      posts, 
      logged_in: req.session.logged_in 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/posts/:id', withAuth, async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });

    const post = postData.get({ plain: true });
    res.render('post', {
      ...post,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Use withAuth middleware to prevent access to route
router.get('/profile', withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Post}],
    });

    const categoryTitle = await Category.findAll({
      include: [
        {
          model: User,
          model: Post,
        }
      ]
    });

    const categories = categoryTitle.map((category) => category.get({ plain: true }));

    const user = userData.get({ plain: true });
    res.render('profile', {
      ...user,
      categories,
      logged_in: true,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/main_page', withAuth, async (req, res) => {
  try {
    const categoryTitle = await Category.findAll({
      include: [
        {
          model: User,
          model: Post,
        }
      ]
    });

    const categories = categoryTitle.map((category) => category.get({ plain: true }));
    
    res.render('main_page', {
      categories,
      logged_in: true,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/categories/:id', withAuth, async (req, res) => {
  try {

    const categoryTitle = await Category.findAll({
      include: [
        {
          model: User,
          model: Post,
        }
      ]
    });

    const categories = categoryTitle.map((category) => category.get({ plain: true }));

    const categoryData = await Category.findByPk(
      req.params.id,
      {
      include: [
        {
          model: Post,
          include: [
            {
              model: User,
            }
          ]
        }
      ]
    });

    const category = categoryData.get({ plain: true });
    
    res.render('category_page', {
      categories,
      category,
      logged_in: true,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/main_page');
    return;
  }

  res.render('login');
});

module.exports = router;
