const request = require('supertest');
const app = require('../express');
const Ticket = require('../models/tickets');
const {
    eventOne,
    ticketOne,
    setupDatabase
} = require('./__mocks__/fixtures/db');

beforeEach(setupDatabase);

test('should create new ticekts', async () => {
    const response = await request(app).post(`/events/ticket/add/${eventOne._id}`).send({
        quantity: 100,
        price: 50,
        event: eventOne._id
    }).expect(201);
    expect(response).not.toBeNull();

});

test('should not create a ticket without all credentials', async () => {
    const response = await request(app).post(`/events/ticket/add/${eventOne._id}`).send({
        quantity: '',
        price: 50,
        event: eventOne._id
    }).expect(400);
    const ticket = await Ticket.findById(response.body._id);
    expect(ticket).toBeNull();
});

test('should get all tickets', async () => {
    const response = await request(app).get('/events/ticket').send().expect(200);
    const tickets = await Ticket.find();
    expect(tickets).not.toBeNull();
});

test('should get specific tickets for specific event', async () => {
    const response = await request(app).get(`/events/ticket/${ticketOne._id}`).send()
        .expect(200);
    const ticket = await Ticket.findById(response.body._id);
    expect(ticket).not.toBeNull();
    expect(toString(ticketOne._id)).toBe(toString(ticket));
});

test('should not get a specific tickets for specific event', async () => {
    const response = await request(app).get(`/events/ticket/5cb0658d2a52e240d4f4df56`).send()
        .expect(404);
    const ticket = await Ticket.findById(response.body._id);
    expect(ticket).toBeNull();
});

test('should edit tickets', async () => {
    const response = await request(app).patch(`/events/ticket/edit/${ticketOne._id}`).send({
        quantity: 500,
        price: 123
    }).expect(200);
    const ticket = await Ticket.findById(response.body._id);
    expect(ticket).not.toBeNull();
    expect(toString(ticket._id)).toBe(toString(response.body._id));
});

test('should not edit ticekts', async () => {
    const response = await request(app).patch(`/events/ticket/edit/${ticketOne._id}`).send({
        quantity: -100,
        price: 100
    } || {
        quantity: 100,
        price: -100
    } || {
        quantity: -100,
        price: -100
    }).expect(400);
    const ticket = await Ticket.findById(response.body._id);
    expect(ticket).toBeNull();
});

test('should buy a ticket', async () => {
    const response = await request(app).patch(`/events/ticket/buy/${ticketOne._id}?token=ok`).send({
        quantity: 2
    }).expect(200);
    expect(response.body).not.toBeNull();
});

test('should not buy a ticket', async () => {
    const response = await request(app).patch(`/events/ticket/buy/${ticketOne._id}?token=ok`).send({
        quantity: ticketOne.quantity + 1
    } || {
        quantity: -10
    }).expect(400);
    expect(response.body.error).not.toBeNull();
});
test('should be card_error during buying a ticket', async () => {
    const response = await request(app).patch(`/events/ticket/buy/${ticketOne._id}?token=card_error`).send({
        quantity: 2
    }).expect(400);
    expect(response.body.error).not.toBeNull();
});
test('should be card_error during buying a ticket', async () => {
    const response = await request(app).patch(`/events/ticket/buy/${ticketOne._id}?token=payment_error`).send({
        quantity: 2
    }).expect(400);
    expect(response.body.error).not.toBeNull();
});