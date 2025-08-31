import { Router } from 'express';
import mongoose from 'mongoose';
const { Schema } = mongoose;
import { user} from '../mongoose/database.js';
import { prod } from '../mongoose/database.js';
import * as dotenv from 'dotenv';
import middle from '../middleware/middle.js';
dotenv.config();
const cart = Router();

// const productSchema = new mongoose.Schema({
//   name: String,
//   imageUrl: String,
//   price: Number,
//   description: String
// });
cart.get('/getall' , async (req , res)=>{
  const cursor = prod.find().cursor();
for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
  console.log(doc);
}
res.send('all product')
})
cart.post('/add',async(req , res)=>{
    // console.log(req.body);
    let payload = {name : req.body.name , imageUrl : req.body.imageUrl , price : req.body.price , description : req.body.description};
    const newprod = new prod({name : req.body.name , imageUrl : req.body.imageUrl , price : req.body.price , description : req.body.description});
    await newprod.save();
    res.send('working')
})
cart.delete('/delete' , async(req , res)=>{
    var id = req.body.id;
    await prod.findByIdAndDelete(id)
    res.send('deleted')
})

export default cart;