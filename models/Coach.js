const Joi = require('joi');
const mongoose = require('mongoose');

//Make a Schema
const CoachSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 50
    },
    noOfCourses: {
        type: Number,
        required: true,
        min: 1,
        max: 100
    },
    expertise: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 500
    },
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5,
        default: 0
    },
    userId: {
        type: String,
        required: true
    }
});

//Use Schema to make a class
const Coach = new mongoose.model('Coach', CoachSchema);

//validate the data send against the schema
function validateCoach(coach) {
    const schema = Joi.object({
        name: Joi.string().min(1).max(50).required(),
        noOfCourses: Joi.number().min(1).max(100).required(),
        expertise: Joi.string().min(1).max(500).required(),
        rating: Joi.number().min(0).max(5).required(),
        userId: Joi.string().required()
    });

    return schema.validate(coach);
}

function validateRating(rating) {
    const schema = Joi.object({
        userId: Joi.string().required(),
        rating: Joi.number().min(0).max(5).required()
    });

    return schema.validate(rating);
}

//export class and func 
module.exports.Coach = Coach;
module.exports.validateCoach = validateCoach;
module.exports.validateRating = validateRating;