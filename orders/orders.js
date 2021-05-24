const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config()

require('./Order')
const Order = mongoose.model('Order')

app.use(bodyParser.json());

mongoose.connect(process.env.DB_URL,  { useNewUrlParser: true, useUnifiedTopology: true }, () => {
    console.log('Order database connected');
})

// I am alive check
app.get('/', (req, res) => {
    res.send('Order service is alive');
})

//post an order
app.post('/orders', (req, res) => {
    console.log(req.body);
    var order = new Order({
        CustomerID: req.body.CustomerID,
        BookID: req.body.BookID,
        initialDate: req.body.initialDate,
        deliveryDate: req.body.deliveryDate
    });
    order.save().then((data) => {
        console.log(data);
        console.log('New order created');
        res.send('New order created');
    }).catch((err) => {
        console.log(err);
        console.log('Failed creating order');
        res.send('Failed creating order');
    })
})

//Get all order
app.get('/orders', (req, res) => {
    Order.find().then((orders) => {
        res.json(orders);
    }).catch((err) => {
        res.send('Failed fetch orders');
    })
})

//Get order by id
app.get('/orders/:id', (req, res) => {
    Order.findById(req.params.id).then(async (order) => {
        if(order) {
            console.log(order);
            // res.json(order);
            axios.get('http://localhost:5555/customers/'+order.CustomerID).then((response) => {
                console.log(response);
                var orderObject = { customerName: response.data.name, bookTitle: ''};
                axios.get('http://localhost:4545/books/'+order.BookID).then((response1) => {
                    console.log(response1);
                    orderObject.bookTitle = response1.data.title;
                    res.json(orderObject);
                })
            })
        } else {
            res.sendStatus(404);
        }
    }).catch((err) => {
        res.send('Failed fetch order');
    })
})

//creating server
app.listen(7777, () => {
    console.log('Up and running the order service');
})