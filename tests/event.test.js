const request = require('supertest');
const app = require('../express');
const Event = require('../models/events');
const {
    eventOne,
    setupDatabase
} = require('./__mocks__/fixtures/db');

beforeEach(setupDatabase);


test("should create a new event", async () => {
    const response = await request(app).post('/event/add').send({
        name: 'Opera Tour',
        description: 'World Wide Tour',
        date: "2019-06-13 20:00:00"
    }).expect(201);

    const event = await Event.findById(response.body._id);
    expect(event).not.toBeNull();

});

test("Should not create duplicate event", async () => {
    const response = await request(app).post('/event/add').send({
        name: eventOne.name,
        description: eventOne.description,
        date: eventOne.date
    }).expect(400);
    const event = await Event.findById(response.body._id);
    expect(event).toBeNull();
});

test("Should not create an event without all credentials", async () => {
    const response = await request(app).post('/event/add').send({
        name: eventOne.name,
        description: '',
        date: eventOne.date
    }).expect(400);
    const event = await Event.findById(response.body._id);
    expect(event).toBeNull();
});

test("should get all events", async () => {
    await request(app).get('/').send({}).expect(200);
    const event = await Event.find({});
    expect(event).not.toBeNull();
});

test('should get an event by id', async () => {
    const response = await request(app).get(`/${eventOne._id}`).send()
        .expect(200);
    const event = await Event.findById(response.body._id);
    expect(event).not.toBeNull();
    expect(toString(event._id)).toBe(toString(response.body._id));
});

test('should not get an event by id', async () => {
    const response = await request(app).get(`/5cb0658d2a52e240d4f4df56`).send()
        .expect(404);
    const event = await Event.findById(response.body._id);
    expect(event).toBeNull();
});