//sample connections data
// {
//     id: 'r1',
//     name: 'Arpan Mallic',
//     email: 'assdf@gfh.bjn',
//     phone: '9856478521',
//     feedbackType: 'Query',
//     feedback: 'Very good lessons thank you'
// },

const Joi = require('joi');
const mongoose = require('mongoose');

//Make a Schema
const ConectionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
                return re.test(v.toLowerCase());
            },
            message: 'not a valid email!'
        }
    },
    phone: {
        type: Number,
        required: true,
        validate: {
            validator: function(v) {
                return /^[0-9]+$/.test(v);
            },
            message: 'not a valid number!'
        }
    },
    feedbackType: {
        type: String,
        enum : ['query','praise','suggession','Query','Praise','Suggession'],
        required: true,
    },
    feedback: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 500
    },
    coachId:{
        type: String,
        required: true,
    }
});

//Use Schema to make a class
const Connection = new mongoose.model('Connection', ConectionSchema);


//validate the data send against the schema
function validateConnection(connection) {
    const schema = Joi.object({
        name: Joi.string().min(1).max(50).required(),
        email: Joi.string().email().required(),
        phone: Joi.number().required(),
        feedbackType: Joi.string().required(),
        feedback: Joi.string().min(1).max(500).required(),
        coachId: Joi.string().required()
    });

    return schema.validate(connection);
}

//use class to make objects
// const connection = new Connection({
//     name: 'Edgar Allen Poe',
//     email: 'asdf@asd.cvc',
//     phone: 9856321478,
//     feedbackType: 'Praise',
//     feedback: 'Very Good',
// });

//connection.save().then(() => console.log('Saved')).catch(() => console.log('err in saving'));

//export class and func 
module.exports.Connection = Connection;
module.exports.validateConnection = validateConnection;