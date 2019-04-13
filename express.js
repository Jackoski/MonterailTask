const express = require('express');
const mongoose = require('mongoose');
const keys = require('./config/dev');
const eventRouter = require('./routers/event');
const ticketRouter = require('./routers/ticket');

const app = express();

//  settign app/json
app.use(express.json());

// connecting app to database
mongoose.connect(keys.MONGO_URI, {
    useNewUrlParser: true
}).then(() => {
    console.log('mongodb connected');
}).catch(e => console.log(e));

// loading routes
app.use(eventRouter);
app.use(ticketRouter);


module.exports = app;