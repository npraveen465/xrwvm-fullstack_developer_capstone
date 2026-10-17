/*jshint esversion: 8 */
const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const cors = require('cors');
const app = express();
const port = 3030;

app.use(cors());
app.use(require('body-parser').urlencoded({ extended: false }));

const bicycles = JSON.parse(fs.readFileSync('bicycles.json', 'utf8'));
const dealerships = JSON.parse(fs.readFileSync('dealerships.json', 'utf8'));
const reviews = JSON.parse(fs.readFileSync('reviews.json', 'utf8'));

const Review = require('./review');
const Dealerships = require('./dealership');

mongoose.connect('mongodb://localhost:27017/', { dbName: 'dealershipsDB' });

app.get('/', async (req, res) => {
    res.send('Welcome to the Mongoose API');
});

app.get('/fetchReviews', async (req, res) => {
    try {
        const documents = await Review.find();
        res.json(documents);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching reviews' });
    }
});

app.get('/fetchReviews/dealer/:id', async (req, res) => {
    try {
        const documents = await Review.find({ dealership: req.params.id });
        res.json(documents);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching reviews by dealer ID' });
    }
});

app.get('/fetchDealers', async (req, res) => {
    try {
        const documents = await Dealerships.find();
        res.json(documents);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching dealerships' });
    }
});

app.get('/fetchDealers/:state', async (req, res) => {
    try {
        const documents = await Dealerships.find({ state: req.params.state });
        res.json(documents);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching dealerships by state' });
    }
});

app.get('/fetchDealer/:id', async (req, res) => {
    try {
        const document = await Dealerships.findOne({ id: parseInt(req.params.id) });
        res.json(document);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching dealership by ID' });
    }
});

app.post('/insert_review', async (req, res) => {
    data = req.body;
    try {
        const review = new Review({
            id: data.id,
            name: data.name,
            dealership: data.dealership,
            review: data.review,
            purchase: data.purchase,
            purchase_date: data.purchase_date,
            car_make: data.car_make,
            car_model: data.car_model,
            car_year: data.car_year,
        });

        const savedReview = await review.save();
        res.json(savedReview);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error inserting review' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
