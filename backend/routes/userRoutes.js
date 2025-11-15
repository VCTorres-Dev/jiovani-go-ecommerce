const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { auth, adminAuth } = require('../middleware/authMiddleware');

// @route   GET api/users
// @desc    Get all users with pagination and search
// @access  Private/Admin
router.get('/', [auth, adminAuth], async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const query = {};

    if (search && search.trim() !== '') {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    const totalUsers = await User.countDocuments(query);
    const totalPages = Math.ceil(totalUsers / limitNum);

    const users = await User.find(query)
      .select('-password')
      .sort({ fechaRegistro: -1 })
      .limit(limitNum)
      .skip((pageNum - 1) * limitNum);

    res.json({ users, totalPages, currentPage: pageNum, totalUsers });
  } catch (err) {
    console.error(`Error fetching users: ${err.message}`);
    res.status(500).json({ message: `Server Error: ${err.message}` });
  }
});

// @route   PUT api/users/:id
// @desc    Update user role
// @access  Private/Admin
router.put('/:id', [auth, adminAuth], async (req, res) => {
  const { role } = req.body;

  // Basic validation
  if (!['user', 'admin'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role specified.' });
  }

  try {
    let user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent admin from demoting themselves if they are the only admin
    if (req.user.id === req.params.id && req.user.role === 'admin' && role === 'user') {
        const adminCount = await User.countDocuments({ role: 'admin' });
        if (adminCount <= 1) {
            return res.status(400).json({ message: 'Cannot demote the last admin.' });
        }
    }

    user.role = role;
    await user.save();

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/users/:id
// @desc    Delete a user
// @access  Private/Admin
router.delete('/:id', [auth, adminAuth], async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent user from deleting themselves
    if (user.id.toString() === req.user.id) {
      return res.status(400).json({ message: 'You cannot delete your own account.' });
    }

    await user.deleteOne();

    res.json({ message: 'User removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
