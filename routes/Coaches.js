const Express = require('express');

const { Coach, validateCoach, validateRating } = require('../models/Coach')
const isRestricted = require('../middleware/auth');

const router = Express.Router();

router.get('/', (req, res) => {
    // throw new Error('dsvs');
    Coach
        .find()
        .sort({ rating: -1 })
        .select(['name', 'expertise', '_id', 'noOfCourses', 'rating' , 'userId'])
        .then((data) => {
            console.log('Success');
            res.send(data);
        })
        .catch((err) => {
            console.log('err in saving' + err.message);
            res.status(500).send({'message':'error in fetching data' + err.message});
        });
})

router.post('/', isRestricted, async (req, res) => {

    //check for error in body using joi
    const { error } = validateCoach(req.body);
    if (error) return res.status(400).send({'message':error.details[0].message});

    let coach = await Coach.findOne({ userId: req.body.userId }); 
    if (!coach) {
    //use class to make objects
    coach = new Coach({
        name: req.body.name,
        noOfCourses: req.body.noOfCourses,
        expertise: req.body.expertise,
        rating: req.body.rating,
        userId: req.body.userId
    });
    coach.save()
        .then((data) => {
            console.log('Saved');
            res.send(data);
        })
        // .catch((err) => {
        //     console.log('err in saving' + err.message);
        //     res.status(500).send({'message':err.message})
        // });
    }
    else {

    Coach.updateOne({ userId: req.body.userId }, {
        $set: {
            name: req.body.name,
            noOfCourses: req.body.noOfCourses,
            expertise: req.body.expertise
        }
    })
        .then((data) => {
            console.log('Updated');
            res.send(data);
        })
        .catch((err) => {
            console.log('err in saving' + err.message);
            res.status(500).send({'message':'err in saving' + err.message})
        });
    }
})

router.patch('/', isRestricted, (req, res) => {

    const { error } = validateRating(req.body);
    if (error) return res.status(400).send({'message':error.details[0].message});

    Coach.updateOne({ userId: req.body.userId }, {
        $set: {
            "rating": req.body.rating
        }
    })
        .then((data) => {
            console.log('Updated');
            res.send(data);
        })
        // .catch((err) => {
        //     console.log('err in saving' + err.message);
        //     res.status(500).send({'message':'err in saving' + err.message})
        // });
})

router.delete('/:userId', (req, res) => {
    Coach
        .deleteOne({ "userId": req.params.userId })
        .then((data) => {
            console.log('Success');
            res.send(data);
        })
        // .catch((err) => {
        //     console.log('err in saving' + err.message);
        //     res.status(500).send({'message':'error in fetching data' + err.message});
        // });
})

router.get('/:id', (req, res) => {
    Coach
        .findById(req.params.id)
        .then((data) => {
            console.log('Success');
            res.send(data);
        })
})

router.get('/user/:userId', (req, res) => {
    Coach
        .findOne({ 'userId': req.params.userId })
        .then((data) => {
            console.log('Success');
            res.send(data);
        })
})
module.exports = router;