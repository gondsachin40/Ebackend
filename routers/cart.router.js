import { Router } from 'express';
import mongoose from 'mongoose';
const { Schema } = mongoose;
import { user } from '../mongoose/database.js';
import { prod } from '../mongoose/database.js';
import * as dotenv from 'dotenv';
import middle from '../middleware/middle.js';
dotenv.config();
const cart = Router();

cart.get('/getall', async (req, res) => {
  try {
    const allProducts = await prod.find();
    res.json(allProducts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
});
cart.get('/getone', async (req, res) => {
  const id = req.query.id;
  try {
    const product = await prod.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
});
cart.post('/add', async (req, res) => {
  // console.log(req.body);
  let payload = { name: req.body.name, imageUrl: req.body.imageUrl, price: req.body.price, description: req.body.description };
  const newprod = new prod({ name: req.body.name, imageUrl: req.body.imageUrl, price: req.body.price, description: req.body.description });
  await newprod.save();
  res.send('working')
})
cart.post('/addbyid', middle, async (req, res) => {
  console.log(req.user)
  const id = req.body.id;
  const result = await user.updateOne(
    { _id: req.user.id, 'products.productId': id },
    { $inc: { 'products.$.count': 1 } }
  );
  if (result.matchedCount === 0) {
    // console.log('nhi chala')
    await user.updateOne(
      { _id: req.user.id },
      { $push: { products: { productId: id, count: 1 } } }
    );
  }
  res.json({ message: 'Product added or count increased successfully' });

});
cart.patch('/updateaddress', middle, async (req, res) => {
  let address = req.body.address;
  console.log(address);
  try {
    await user.updateOne({ _id: req.user.id }, { $set: { address: address } });
    res.json({ message: 'address updated' });
  } catch (err) {
    res.json({ message: 'error in updating address' })
  }
});
cart.post('/removebyid', middle, async (req, res) => {
  const id = req.body.id;
  const userDoc = await user.findOne({ _id: req.user.id });
  if (!userDoc) return res.json({ message: 'User not found' });

  const product = userDoc.products.find(p => p.productId === id);
  if (product && product.count > 0) {
    product.count--;
    await userDoc.save();
    return res.json({ message: 'count decreased', count: product.count });
  } else {
    return res.json({ message: 'no update done' });
  }
});
cart.get('/mycart', middle, async (req, res) => {
  let id = req.user.id;
  const userDoc = await user.findOne({ _id: id });
  if (!userDoc) {
    return res.json({ message: 'User not found' });
  }
  const productsArray = userDoc.products;
  let total = 0;
  let final = [];
  for await (const doc of productsArray) {
    let imgId = doc.productId;
    const data = await prod.findOne({ _id: imgId });
    let jsonObject = data.toJSON();
    jsonObject = { ...jsonObject, count: doc.count };
    final.push(jsonObject)
    total += data.price;
  }
  res.json({ products: final, total: total });
})


export default cart;