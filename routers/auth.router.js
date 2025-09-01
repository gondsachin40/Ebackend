import { Router } from 'express';
import mongoose from 'mongoose';
const { Schema } = mongoose;
import jwt from 'jsonwebtoken';
import { user} from '../mongoose/database.js';
import * as dotenv from 'dotenv';
import middle from '../middleware/middle.js';
dotenv.config();
const router = Router();
const key = "$$";
router.post('/signup' ,async (req , res)=>{
  let payload = {username : req.body.username , password : req.body.password};
  console.log(payload)
  const e = await user.findOne({username : payload.username});
  if(!e){
    console.log('user already exist');
    return res.json(({message : "user already exist"}));
  }
    const user1 = new user({username : payload.username , password : payload.password})
    await user1.save();
    let token = jwt.sign({ id: user1._id }, key, { expiresIn: '10s' });
    res.set('Authorization', 'Bearer ' + token);
    res.json({token  : token});
})

router.post('/signin' , async(req , res)=>{
  let payload = {username : req.body.username , password : req.body.password};
  let token = jwt.sign(payload , key);
  const e = await user.findOne({username : payload.username});
  console.log(e);
  if(!e){
    console.log('user not exist');
    return res.json(({message : "user not exist"}));
  }
  let currentpass = payload.password;
  let originalpass = e.password;
  console.log(originalpass , currentpass)
  if(currentpass === originalpass){
  res.set('Authorization', 'Bearer ' + token);
  return res.json({message : 'login successful', token});
  }
  res.json({message : "password not matched"});
})
router.get('/logout', (req, res) => {
  delete req.headers['Authorization']; 
  res.send('Logged out and authorization header removed');
});
router.get('/name' , middle , (req , res)=>{
  res.send('username exist');
})

export default router