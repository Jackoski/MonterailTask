const mongoose = require('mongoose');
const Event = require('../../../models/events');
const Ticket = require('../../../models/tickets');
const eventOneID = new mongoose.Types.ObjectId;
const eventTwoID = new mongoose.Types.ObjectId;
const ticketOneID = new mongoose.Types.ObjectId;
const eventOne = {
    _id: eventOneID,
    name: "Rammstein",
    description: "event promoting new album",
    date: '2019 04 30 12:00:00'
};

const ticketOne = {
    _id: ticketOneID,
    quantity: 100,
    price: 50,
    event: eventOne._id
};

const setupDatabase = async () => {
    await Event.deleteMany();
    await Ticket.deleteMany();
    await new Event(eventOne).save();
    await new Ticket(ticketOne).save();
};

module.exports = {
    eventOne,
    ticketOne,
    setupDatabase
};