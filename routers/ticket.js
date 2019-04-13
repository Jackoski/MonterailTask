const express = require('express');
const Ticket = require('../models/tickets');
const PaymentGateway = require('../src/payment');
const router = new express.Router();
let amount;

// create a ticket

router.post('/events/ticket/add/:id', async (req, res) => {
    const ticket = new Ticket({
        ...req.body,
        event: req.params.id
    });
    try {
        await ticket.save();
        res.status(201).send(ticket);
    } catch (err) {
        res.status(400).send(err);
    };
});

// getting all tickets

router.get('/events/ticket', async (req, res) => {
    try {
        const allTickets = await Ticket.find({}).populate('event');
        if (!allTickets) {
            return res.status(200).send({
                msg: 'No tickets for upcoming events found'
            });
        };
        res.status(200).send(allTickets);
    } catch (err) {
        res.status(500).send(err);
    };
});

// getting specific tickets for specific event

router.get('/events/ticket/:id', async (req, res) => {
    try {
        const specificTicket = await Ticket.findById(
            req.params.id
        ).populate('event');
        if (!specificTicket) {
            return res.status(404).send({
                error: 'No tickets for event found'
            });
        };
        res.send(specificTicket);
    } catch (err) {
        res.status(500).send(err);
    };
});

// editing a specific ticket

router.patch('/events/ticket/edit/:id', async (req, res) => {
    try {
        const editTicket = await Ticket.findById(req.params.id)
            .populate('event');
        if (req.body.quantity < 0) {
            return res.status(400).send({
                error: 'You cannot set quantity as a negative number'
            });
        };

        if (req.body.price < 0) {
            return res.status(400).send({
                error: 'You cannot set the price of ticket as a negative number'
            });
        };

        editTicket.quantity = req.body.quantity;
        editTicket.price = req.body.price;
        editTicket.save();
        res.status(200).send(editTicket);
    } catch (err) {
        res.status(500).send(err);
    };
});


// buying a ticket

router.patch('/events/ticket/buy/:id', async (req, res) => {
    try {
        const buyTicket = await Ticket.findById(req.params.id)
            .populate('event');
        if (buyTicket.quantity == 0) {
            return res.send({
                error: 'All tickets for the event are sold out.'
            });
        };
        if (buyTicket.quantity < req.body.quantity) {
            return res.status(400).send({
                error: `sorry, we do not have that amount of ticket. Number of tickets left: ${buyTicket.quantity}`
            });
        };
        if (req.body.quantity <= 0) {
            return res.status(400).send({
                error: 'You must add minimum 1 ticket to your cart'
            });
        };
        amount = req.body.quantity * buyTicket.price;
        let pay = new PaymentGateway();
        pay.charge(amount, req.query.token).then((payment) => {
            res.send(payment);
            buyTicket.quantity -= req.body.quantity;
            buyTicket.save();
        }).catch(e => {
            res.status(400).send({
                error: e.message
            });
        });

    } catch (err) {
        res.status(500).send(err);
    };
});

// 404 page

router.get('*', (req, res) => {
    res.status(404).send('&nbsp &nbsp  ¯\\_(ツ)_/¯ 404 Page not found...');
});



module.exports = router;