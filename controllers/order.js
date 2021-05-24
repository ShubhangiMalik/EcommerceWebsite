const {Order, CartItem} = require('../models/order')
const { errorhandler} = require('../helpers/dbErrorHandler')
const apiKey = process.env.apiKey;
const { SMTPClient } = require('emailjs');


exports.orderById = (req , res , next , id) => {
    Order.findById(id)
    .populate('products.product', 'name price')
    .exec((err , order) => {
          if( err || !order){
            return res.status(400).json({
                error:errorhandler(err)
            })    
          }
          req.order = order
          next()
    })
} 

// exports.create = (req, res) => {
//    // console.log('create order :' , req.body)
//    req.body.order.user = req.profile
//    const order = new Order(req.body.order)
//    order.save((error, data) => {
//        if(error) {
//            return res.status(400).json({
//                error:errorhandler(error)
//            })
//        }
//        res.json(data)
//    })
// }

exports.listOrders =(req , res) => {
    Order.find()
    .populate('user', "_id name address")
    .sort('-created')
    .exec((error, orders) => {
        if(error) {
            return res.status(400).json({
                error:errorhandler(error)
            })
        }
        res.json(orders)
    })

}

exports.getStatusValues = ( req , res) => {
    res.json(Order.schema.path('status').enumValues)
}

exports.updateOrderStatus = (req , res) => {
    Order.updateOne(
        {_id: req.body.orderId} , 
        {$set: {status: req.body.status}},
        (err , order) => {
            if(err) {
                return res.status(400).json({
                    error:errorhandler(err)
                })
            }
            res.json(order)
        }
    )
}





const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(apiKey);
 
// your create order method with email capabilities
exports.create = (req, res) => {
    console.log('CREATE ORDER: ', req.body);
    req.body.order.user = req.profile;
    const order = new Order(req.body.order);
    order.save((error, data) => {
        if (error) {
            return res.status(400).json({
                error: errorHandler(error)
            });
        }
        // User.find({ categories: { $in: categories } }).exec((err, users) => {}
       // console.log('ORDER IS JUST SAVED >>> ', order);
        // send email alert to admin
       // order.address
        //order.products.length
        //order.amount
        const emailData = {
            to: 'shubhangimalik28@gmail.com', // admin
            from: 'shubhangimalik28@gmail.com',
            subject: `A new order is received`,
            html: `
            <h1>Hey Admin, Somebody just made a purchase in your ecommerce store</h1>
            <h2>Customer name: ${order.user.name}</h2>
            <h2>Customer address: ${order.address}</h2>
            <h2>User's purchase history: ${order.user.history.length} purchase</h2>
            <h2>User's email: ${order.user.email}</h2>
            <h2>Total products: ${order.products.length}</h2>
            <h2>Transaction ID: ${order.transaction_id}</h2>
            <h2>Order status: ${order.status}</h2>
            <h2>Product details:</h2>
            <hr />
            ${order.products
                .map(p => {
                    return `<div>
                        <h3>Product Name: ${p.name}</h3>
                        <h3>Product Price: ${p.price}</h3>
                        <h3>Product Quantity: ${p.count}</h3>
                </div>`;
                })
                .join('--------------------')}
            <h2>Total order cost: ${order.amount}<h2>
            <p>Login to your dashboard</a> to see the order in detail.</p>
        `
        };
        sgMail
            .send(emailData)
            .then(sent => console.log('SENT >>>', sent))
            .catch(err => console.log('ERR >>>', err));
 
        // email to buyer
        const emailData2 = {
            to: order.user.email,
            from: 'shubhangimalik28@gmail.com',
            subject: `You order is in process`,
            html: `
            <h1>Hey ${req.profile.name}, Thank you for shopping with us.</h1>
            <h2>Total products: ${order.products.length}</h2>
            <h2>Transaction ID: ${order.transaction_id}</h2>
            <h2>Order status: ${order.status}</h2>
            <h2>Product details:</h2>
            <hr />
            ${order.products
                .map(p => {
                    return `<div>
                        <h3>Product Name: ${p.name}</h3>
                        <h3>Product Price: ${p.price}</h3>
                        <h3>Product Quantity: ${p.count}</h3>
                </div>`;
                })
                .join('--------------------')}
            <h2>Total order cost: ${order.amount}<h2>
            <p>Thank your for shopping with us.</p>
        `
        };
        sgMail
            .send(emailData2)
            .then(sent => console.log('SENT 2 >>>', sent))
            .catch(err => console.log('ERR 2 >>>', err));
 
        res.json(data);
    });
};


// exports.create = (req, res) => {
//     req.body.order.user = req.profile;
//     const order = new Order(req.body.order);


// const client = new SMTPClient({
// 	user: 'Shubhangi',
// 	password: '8447666294',
// 	host: 'smtp.shubhangimalik28@gmail.com',
// 	ssl: true,
// });

// // send the message and get a callback with an error or details of the message that was sent
// client.send(
// 	{
// 		text: 'i hope this works',
// 		from: 'shubhangimalik28062000@gmail.com',
// 		to: 'roop.malik@yahoo.com',
// 	//	cc: 'else <else@your-email.com>',
// 		subject: 'testing emailjs',
// 	},
// 	(err, message) => {
// 		console.log(err || message);
// 	}
// );
//}


// var nodemailer = require('nodemailer');

// var transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'shubhangimalik28@gmail.com',
//     pass: process.env.PASSWORD
//   }
// });

// var mailOptions = {.
//   from: 'shubhangimalik286A@gmail.com',
//   to: 'shubhangimalik28062000@gmail.com',
//   subject: 'Sending Email using Node.js',
//   text: 'That was easy!'
// };

// transporter.sendMail(mailOptions, function(error, info){
//   if (error) {
//     console.log(error);
//   } else {
//     console.log('Email sent: ' + info.response);
//   }
// });
