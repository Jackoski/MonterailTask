const mongoose = require('mongoose');
require('../models/events');
const Event = mongoose.model('Event');
const TicketSchema = new mongoose.Schema({

    quantity: {
        type: Number,
        required: true,
        trim: true,
        validate(value) {
            if (value < 0) {
                throw new Error('quantity cannot by a negative number')
            }
        }
    },
    price: {
        type: Number,
        required: true,
        trim: true,
        validate(value) {
            if (value < 0) {
                throw new Error('price cannot by a negative number')
            }
        }
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Event'
    }
});


const Ticket = mongoose.model('Ticket', TicketSchema);

module.exports = Ticket;