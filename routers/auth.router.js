import { Router } from 'express';
import mongoose from 'mongoose';
const { Schema } = mongoose;
import jwt from 'jsonwebtoken';
import { user } from '../mongoose/database.js';
import * as dotenv from 'dotenv';
import middle from '../middleware/middle.js';
dotenv.config();
const router = Router();
const key = "$$";
router.post('/signup', async (req, res) => {
  let payload = { username: req.body.username, password: req.body.password, address: req.body.address };
  console.log(payload)
  const e = await user.findOne({ username: payload.username });
  if (e !== null) {
    console.log('user already exist');
    return res.status(400).json(({ message: "user already exist" }));
  }
  const user1 = new user({ username: payload.username, password: payload.password, address: payload.address })
  await user1.save();
  console.log(user1);
  let token = jwt.sign({ id: user1._id }, key);
  res.set('Authorization', 'Bearer ' + token);
  res.status(200).json({ token: token });
})

router.post('/signin', async (req, res) => {
  const e = await user.findOne({ username: req.body.username });
  console.log(e);
  if (!e) {
    console.log('user not exist');
    return res.json(({ message: "user not exist" }));
  }
  let currentpass = req.body.password;
  let originalpass = e.password;
  console.log(originalpass, currentpass)
  if (currentpass === originalpass) {
    let token = jwt.sign({ id: e._id }, key);
    res.set('Authorization', 'Bearer ' + token);
    return res.json({ message: 'login successful', token });
  }
  res.json({ message: "password not matched" });
})
router.get('/logout', (req, res) => {
  delete req.headers['Authorization'];
  res.send('Logged out and authorization header removed');
});
router.get('/name', middle, (req, res) => {
  res.send('username exist');
})

export default router