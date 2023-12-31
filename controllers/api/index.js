const router = require('express').Router();
const userRoutes = require('./userRoutes');
const postRoutes = require('./postRoutes');
const categoryRoutes = require('./categoryRoutes');

router.use('/categories', categoryRoutes);
router.use('/users', userRoutes);
router.use('/posts', postRoutes);

module.exports = router;