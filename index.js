import express from 'express';
import router from './routers/auth.router.js';
import main from './mongoose/database.js';
const app = express();
app.use(express.json());
app.get('/' , (req , res) => {
    res.send('server is listening on port 3000')
})

app.use('/auth', router)


main().then(()=>{
    console.log('connected to db');
    app.listen(3000 , ()=>{
            console.log('my server is listening to 3000')
    });
}).catch((e)=>{
    console.log(e);
})
