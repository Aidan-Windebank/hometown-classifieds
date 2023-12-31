const router = require('express').Router();
const { Post , User, Category} = require('../../models');
const withAuth = require('../../utils/auth');

 router.get('/', async (req, res) => {
  const results = await Post.findAll();
   res.status(200).json({ results });
 });

 router.get('/:id', async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id, {
      include: {
        model: User,
        attributes: ['email'],
    },

    });
    if (!postData) {
      res.status(404).json({ message: 'No post with this id!' });
      return;
    }
    res.status(200).json(postData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', withAuth, async (req, res) => {
  try {
    const newPost = await Post.create({
      title:req.body.title,
      description:req.body.description,
      price: req.body.price,
      category_id:req.body.category_id,
      user_id: req.session.user_id,
    });

    res.status(200).json(newPost);
  } catch (err) {
    res.status(400).json(err);
  }
});

//ability to update posts? both the
router.put('/:id',withAuth,async(req,res)=>{
  try {
    const postData = await Post.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    if (!postData[0]) {
      res.status(404).json({ message: 'No post with this id!' });
      return;
    }
    res.status(200).json(postData);
  } catch (err) {
    res.status(500).json(err);
  }
});


router.delete('/:id', withAuth, async (req, res) => {
  try {
    const postData = await Post.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!postData) {
      res.status(404).json({ message: 'No post found with this id!' });
      return;
    }

    res.status(200).json(postData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
