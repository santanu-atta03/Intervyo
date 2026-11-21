const express = require('express');
const router = express.Router();
const { validateName } = require('../utils/validation');

router.post('/', validateName, (req, res) => {
  // Handle contact form submission
  res.status(200).json({ message: 'Contact form submitted successfully' });
});

module.exports = router;
