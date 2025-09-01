import mongoose, { mongo } from 'mongoose';
const { Schema } = mongoose;
import * as dotenv from 'dotenv';
dotenv.config();
const url = process.env.URL;
const schema = new Schema({
  username: { type: String, unique: true },
  password: Number,
  address: String,
  products: [
    {
      productId: String,
      count: Number
    }
  ]
});

const productSchema = new mongoose.Schema({
  name: String,
  imageUrl: String,
  price: Number,
  description: String
});
// const prod1 = new prod({
//         name : "phone",
//         imageUrl : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrmmxwgLSZMQ6YG1Q1SziIxGwyqnyHBNnqbA&s",
//         price : 10000,
//         description : "infinix phone under 10000"
//     })
//     await prod1.save();
const user = mongoose.models?.user || mongoose.model('user', schema);
const prod = mongoose.models?.product || mongoose.model('product', productSchema);
async function main() {
  await mongoose.connect(url);
}
export default main;
export { user, prod };





// const user1 = new user({username : "sachin" , password : 123})
// user1.save();
// let names = ["sachin", "gourav", "sourabh", "shivangi"];
// for (let name of names) {
//     const user1 = new user({ name: `${name}`, age: 30, city: "bhopal" });
//     await user1.save();
// }
// const data = await user.find({});
// console.log(data)