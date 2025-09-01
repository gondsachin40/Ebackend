import { Router } from 'express';
import mongoose from 'mongoose';
const { Schema } = mongoose;
import { user } from '../mongoose/database.js';
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
  const { id, username } = req.body
  const result = await user.updateOne(
    { username: username, 'products.productId': id },
    { $inc: { 'products.$.count': 1 } }
  );
  if (result.matchedCount === 0) {
    await user.updateOne(
      { username: username },
      { $push: { products: { productId: id, count: 1 } } }
    );
  }
  res.json({ message: 'Product added or count increased successfully' });

});
cart.patch('/updateaddress', async (req, res) => {
  let username = req.body.username;
  let address = req.body.address;
  console.log(username, address)
  try {
    await user.updateOne({ username: username }, { $set: { address: address } });
    res.json({ message: 'address updated' });
  } catch (err) {
    res.json({ message: 'error in updating address' })
  }
});
cart.post('/removebyid', async (req, res) => {
  const { id, username } = req.body;
  const productIsOne = await user.findOne({
    username: username,
    products: { $elemMatch: { productId: id, count: 1 } }
  });

  if (productIsOne) {
    await user.updateOne(
      { username: username },
      { $pull: { products: { productId: id } } }
    );
    return res.json({ message: 'Product removed from cart' });
  }
  const decrementResult = await user.updateOne(
    { username: username, 'products.productId': id },
    { $inc: { 'products.$.count': -1 } }
  );

  if (decrementResult.matchedCount === 0) {
    return res.status(404).json({ message: 'Product or user not found' });
  }

  res.json({ message: 'Product count decreased by 1' });
});

cart.post('/alluser', async (req, res) => {
  let username = req.body.username;
  const userDoc = await user.findOne({ username: username });
  if (!userDoc) {
    return res.json({ message: 'User not found' });
  }
  const productsArray = userDoc.products;
  res.json({ products: productsArray });
})


export default cart;