const express = require('express');

const app = express();

const http = require('http').Server(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');

app.use(express.static(__dirname));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const dbUrl = "mongodb://localhost:27017/node_test";

var Message = mongoose.model('Message', {
    name: String,
    message: String
});

// var messages = [
//     { name: 'Jachrix', message: 'Hi..' },
//     { name: 'Obinna', message: 'Hello..' }
// ]

app.get('/messages', (req, res) => {
    Message.find({}, (err, messages) => {
        res.send(messages);
    });
});

app.post('/messages', async(req, res) => {
    //console.log(req.body);
    var message = new Message(req.body);
    await message.save((err) => {
        if (err) {
            //return res.sendStatus(500)
            console.log(err);
        } else {
            //messages.push(req.body);
            io.emit('message', req.body);
            res.sendStatus(200);
        }

        // if (err)
        //     console.log(err);

        // //res.sendStatus(500)

        // io.emit('message', req.body)
        // res.sendStatus(200)
    });
});

io.on('connection', (socket) => {
    console.log('a user connected .....');
});

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}, (err) => {
    console.log('connected to MongoDB successfully......', err);
});

const port = process.env.port || 3000;


const server = http.listen(port, () => {
    // console.log(`Connected to port: ${port}`);
    console.log('Server listening on port', server.address().port);
});