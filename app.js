const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const morgan = require('morgan')
//const bodyParser = require('body-parser')
//to save user credentials in cookie
const cookieParser = require('cookie-parser')
const cors = require('cors')
const expressValidator = require('express-validator')
require('dotenv').config()


//import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');
const braintreeRoutes = require('./routes/braintree');
const orderRoutes = require('./routes/order');

//app
const app = express()

//db
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}).then (() =>{
    console.log('DB connected');
})


//middleswares
app.use(morgan('dev'));

//get json data from req body
app.use(express.json());

app.use(cookieParser());

app.use(expressValidator());
app.use(cors());

//routes middleware
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);
app.use('/api' , braintreeRoutes);
app.use('/api' , orderRoutes);

const port = process.env.PORT || 8000

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})

if(process.env.NODE_ENV == "production"){
     app.use(express.static(path.join(__dirname, '/ecommerce-front/build')))

     app.get('*' , (req, res) => {
         res.sendFile(path.join(__dirname, 'ecommerce-front', 'build' , 'index.html'))
     })
     }else{
        app.get('/api' , (req,res) => {
            res.send("Api running")
        })
}