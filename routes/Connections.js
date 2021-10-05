const Express = require('express');

const {Connection,validateConnection} = require('../models/Connection');
const isRestricted = require('../middleware/auth');

const router = Express.Router();

router.get('/:userId', isRestricted, (req, res) => {

    Connection
        .find({ coachId:req.params.userId})
        .sort({ rating: 1 })
        .select(['name', 'email', '_id', 'phone', 'feedbackType' , 'feedback' , 'coachId'])
        .then((data) => {
            console.log('Success');
            res.send(data);
        })
        // .catch((err) => {
        //     console.log('err in saving' + err.message);
        //     res.status(500).send({'message':'error in fetching data' + err.message});
        // });
})

router.post('/', (req, res) => {

    //check for error in body using joi
    const { error } = validateConnection(req.body);
    if (error) return res.status(400).send({'message':error.details[0].message});

    //use class to make objects
    const connection = new Connection({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        feedbackType: req.body.feedbackType,
        feedback: req.body.feedback,
        coachId: req.body.coachId
    });
    connection.save()
        .then((data) => {
            console.log('Saved');
            res.send(data);
        })
        // .catch((err) => {
        //     console.log('err in saving' + err.message);
        //     res.status(500).send(connection)
        // });
})

router.delete('/:id', isRestricted ,(req, res) => {
    Connection.deleteOne({ "_id": req.params.id })
        .then((data) => {
            console.log('Success');
            res.send(data);
        })
        // .catch((err) => {
        //     console.log('err in saving' + err.message);
        //     res.status(500).send({'message':'error in fetching data' + err.message});
        // });
})

module.exports = router;