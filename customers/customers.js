const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config()

require('./Customer')
const Customer = mongoose.model('Customer')

app.use(bodyParser.json());

mongoose.connect(process.env.DB_URL,  { useNewUrlParser: true, useUnifiedTopology: true }, () => {
    console.log('Customer database connected');
})

// I am alive check
app.get('/', (req, res) => {
    res.send('Customer service is alive');
})

//post a customer
app.post('/customers', (req, res) => {
    console.log(req.body);
    var customer = new Customer({
        name: req.body.name,
        age: req.body.age,
        address: req.body.address,
    });
    customer.save().then((data) => {
        console.log(data);
        console.log('New customer created');
        res.send('New customer created');
    }).catch((err) => {
        console.log(err);
        console.log('Failed creating customer');
        res.send('Failed creating customer');
    })
})

//Get all customers
app.get('/customers', (req, res) => {
    Customer.find().then((customers) => {
        res.json(customers);
    }).catch((err) => {
        res.send('Failed fetch customers');
    })
})

//Get customer by id
app.get('/customers/:id', (req, res) => {
    Customer.findById(req.params.id).then((customer) => {
        if(customer) {
            res.json(customer);
        } else {
            res.sendStatus(404);
        }
    }).catch((err) => {
        res.send('Failed fetch customer');
    })
})

//Delete a book
app.delete('/customers/:id', (req, res) => {
    Customer.findByIdAndRemove(req.params.id).then((customer) => {
        if(customer) {
            res.json(customer);
        } else {
            res.send('Failed delete customer');    
        }
    }).catch((err) => {
        res.send('Failed delete customer');
    })
})

//creating server
app.listen(5555, () => {
    console.log('Up and running the customer service');
})