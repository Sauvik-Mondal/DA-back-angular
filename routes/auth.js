const Joi = require('joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const {User} = require('../models/user');
const express = require('express');
const isRestricted = require('../middleware/auth');
const router = express.Router();

router.post('/', async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send({'message':error.details[0].message});

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send({'message':'Invalid email or password.'});

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send({'message':'Invalid email or password.'});

  const token = user.generateAuthToken();
  res.send({'idToken':token,'expiresIn':3600,'localId':user._id,'isCoach':user.isCoach});
});

router.patch('/', isRestricted , async (req, res) => {

  User.updateOne({ _id: req.body.localId }, {
    $set: {
        "isCoach": req.body.isCoach
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
});

function validate(req) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required()
  });

  return schema.validate(req);
}

module.exports = router; 


