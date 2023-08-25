// routes/user.js

const express = require('express')

const router = express.Router()

const bcrypt = require('bcrypt')

const jwt = require('jsonwebtoken')

const userModel = require('../models/user.model')


require("dotenv").config()
router.post('/register', async (req, res) => {
  try {
    const { username, email, password,avatar } = req.body

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = new userModel({ username, email, password: hashedPassword,avatar})

    await user.save();
    res.status(201).json({ message: 'User registered successfully' })

  } catch (error) {
    res.status(500).json({ message: 'Failed to register user' })

  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await userModel.findOne({ email })

    if (!user) {
      return res.status(401).json({ message: 'Authentication failed' })

    }
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Authentication failed' });
    }
    const token = jwt.sign({ userId: user._id }, 'process.env.key')

    res.status(200).json({ token })

  } catch (error) {

    res.status(500).json({ message: 'Failed to authenticate' });
  }
});

module.exports = router;