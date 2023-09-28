const { Server } = require('socket.io');
const utils = require('./serverUtils')

const exampleQuestion = {"question": "Bla bla bla, test", "answers": [{"id": 0, "answer": "bla bla svar 1"}, {"id": 1, "answer": "bla bla svar 2"}, {"id": 2, "answer": "bla bla svar 3"}, {"id": 3, "answer": "blas ba svar 4"}]}

function initializeSocket(server) {
    const io = new Server(server, utils.config.cors);
    const clients = new Set();
    const answers = new Set();
    let gameState = 'stopped'; //possible states: 'stopped', 'starting', 'started'
    
    io.on('connection', (socket) => {
        clients.add(socket.id)
        utils.log.socketio('New user connected. ID: '+socket.id);
        io.emit('GameClientSync', clients)

        socket.on('disconnect', (e) => {
            clients.delete(socket.id)
            utils.log.socketio(`User ${socket.id} disconnected`);
            io.emit('GameClientSync', clients)
        });
        socket.on('GameStartReq', () => {
            gameState = 'starting';
            utils.log.socketio('Received GameStartReq, broadcasting GameStarting event to all clients.')
            io.emit('GameStarting')
            setTimeout(() => {
            gameState = 'started';
            utils.log.socketio('timeout elapsed, sending first Question..')
            io.emit("GameQuestion", exampleQuestion)
            }, 5000)
        })
        
        socket.on('GameAnswer', (e) => {
            if (gameState != 'started') return;
            console.log(clients); 

            function registerAnswer(userid, answerid) {
                const set = {userid, answerid}
                if (answers.has(set)) return utils.warn.socketio(`${socket.id} attempted to answer, but has already answered this question.`)
                answers.add(set)
            }
            
            utils.log.socketio(`Recieved answer ${e} from ${socket.id}`)
            registerAnswer(socket.id, e)
            console.log(answers); 
            
            if (answers.count >= clients.count) {
                utils.log.socketio('answers >= connectedClients')
                io.emit('GameResult', 1)
            }
        })
    });
  return io;
}

module.exports = initializeSocket;