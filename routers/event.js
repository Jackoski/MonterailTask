const express = require('express');
const mongoose = require('mongoose');
const Event = require('../models/events');
const router = new express.Router();


// creating new event 

router.post('/event/add', async (req, res) => {
    const event = new Event(req.body);
    try {
        await event.save();
        res.status(201).send(event);
    } catch (err) {
        res.status(400).send(err);
    }
});

//getting all events
router.get('/', async (req, res) => {
    try {
        const allEvents = await Event.find({});
        res.status(200).send(allEvents);
    } catch (err) {
        res.status(500).send(err);
    }

});

//getting specific event by id
router.get('/:id', async (req, res) => {
    try {
        const anEvent = await Event.findById(req.params.id);
        if (!anEvent) {
            return res.status(404).send({
                error: 'event not found'
            });
        };
        res.send(anEvent);
    } catch (err) {
        res.status(500).send(err);
    };
});





module.exports = router;