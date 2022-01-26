//node imports
require('express-async-errors');
const winston = require('winston');
require('winston-mongodb');
const Express = require('express');
const mongoose = require('mongoose');
const config = require('config');

//local imports
const coaches = require('./routes/Coaches');
const connections = require('./routes/Connections');
const users = require('./routes/users');
const auth = require('./routes/auth');

//initialisation
const app = Express();
const port = process.env.PORT || 3000;

//middlewares
app.use(Express.json());

process.on('uncaughtException',(ex) => {
    winston.error(ex.message,ex);
    console.error("uncaughtException");
    exit(1);
})

//or
//winston.handleExceptions(new winston.transports.File({ filename: 'exception.log'}));

process.on('unhandledRejection',(ex) => {
    winston.error(ex);
    console.error(ex);
    exit(1);
})

winston.add(new winston.transports.File({ filename: 'logger.log'}));
winston.add(new winston.transports.MongoDB({ db:'mongodb://localhost/DA'}));

if(!config.get('jwtPrivateKey')){
    console.log('Please provide jet key in vidly_jwtPrivateKey')
    process.exit(1);
}
//connect to db
mongoose.connect('mongodb://localhost/DA',{ useUnifiedTopology: true })
.then(() => console.log('connected'))
.catch(() => console.log('error in connection'));


app.use('/api/coaches/',coaches);
app.use('/api/connections/',connections);
app.use('/api/users', users);
app.use('/api/auth', auth);

app.use('/',(req,res) => {
    res.status(404).send({'message':'no page'});
})

app.use(function(err, req, res, nxt) {
    winston.error(err.message,err);
    res.status(500).send({'message':'internal error'+err});
});

app.listen(port,() => {
    console.log(`listening on port ${port}`) 
}) 