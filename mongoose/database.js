import mongoose from 'mongoose';
const { Schema } = mongoose;
import * as dotenv from 'dotenv';
dotenv.config();
const url = process.env.URL;
const schema = new Schema({
    username: String,
    password: Number
});

const user = mongoose.models?.user || mongoose.model('user', schema);
async function main() {
    await mongoose.connect(url);
}
export default main;
export {user};





 // const user1 = new user({username : "sachin" , password : 123})
    // user1.save();
    // let names = ["sachin", "gourav", "sourabh", "shivangi"];
    // for (let name of names) {
    //     const user1 = new user({ name: `${name}`, age: 30, city: "bhopal" });
    //     await user1.save();
    // }
    // const data = await user.find({});
    // console.log(data)