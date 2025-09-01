import express from 'express';
import router from './routers/auth.router.js';
import cart from './routers/cart.router.js';
import main from './mongoose/database.js';
import cors from 'cors';
const app = express();
app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
    res.send('server is listening on port 3000')
})

app.use('/auth', router)
app.use('/cart', cart)


main().then(() => {
    console.log('connected to db');
    app.listen(3000, () => {
        console.log('my server is listening to 3000')
    });

}).catch((e) => {
    console.log(e);
})
