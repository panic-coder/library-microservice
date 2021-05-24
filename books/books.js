const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config()

require('./Book')
const Book = mongoose.model('Book')

app.use(bodyParser.json());

mongoose.connect(process.env.DB_URL,  { useNewUrlParser: true, useUnifiedTopology: true }, () => {
    console.log('Books database connected');
})

// I am alive check
app.get('/', (req, res) => {
    res.send('Book service is alive');
})

// Post a book
app.post('/books', (req, res) => {
    var book = new Book({
        title: req.body.title,
        author: req.body.author,
        numberOfPages: req.body.numberOfPages,
        publisher: req.body.publisher
    });
    book.save().then((data) => {
        console.log(data);
        console.log('New book created');
        res.send('New book created');
    }).catch((err) => {
        console.log(err);
        console.log('Failed creating book');
        res.send('Failed creating book');
    })
})

//Get all books
app.get('/books', (req, res) => {
    Book.find().then((books) => {
        res.json(books);
    }).catch((err) => {
        res.send('Failed fetch books');
    })
})

//Get book by id
app.get('/books/:id', (req, res) => {
    Book.findById(req.params.id).then((book) => {
        if(book) {
            res.json(book);
        } else {
            res.sendStatus(404);
        }
    }).catch((err) => {
        res.send('Failed fetch books');
    })
})

//Delete a book
app.delete('/books/:id', (req, res) => {
    Book.findByIdAndRemove(req.params.id).then((book) => {
        if(book) {
            res.json(book);
        } else {
            res.send('Failed delete books');    
        }
    }).catch((err) => {
        res.send('Failed delete books');
    })
})

//creating server
app.listen(4545, () => {
    console.log('Up and running the book service');
})