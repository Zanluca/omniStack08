const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')

const routes = require('./routes');
const config = require('./config/dbConfing')

const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)

const connectedUser = {

}

io.on('connection', socket => {
    const {user} = socket.handshake.query   

    connectedUser[user] = socket.id  
})

mongoose.connect(`mongodb+srv://${config.user}:${config.password}@cluster0-jpwaf.mongodb.net/omnistack8?retryWrites=true&w=majority`, {
    useNewUrlParser : true
})

app.use((req, res, next) => {
    req.io = io
    req.connectedUser = connectedUser

    return next()
})

app.use(express.json())
app.use(cors())
app.use(routes);

server.listen(3333);