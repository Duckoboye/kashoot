import {
    Server,
    Socket
} from 'socket.io';
import {
    config
} from './utils';
import {
    Server as HttpServer
} from 'http';
import { socketLogger } from './server';

interface Answer {
    userid: string;
    answerid: string;
}

const exampleQuestion = {
    question: 'Bla bla bla, test',
    answers: [{
            id: 0,
            answer: 'bla bla svar 1'
        },
        {
            id: 1,
            answer: 'bla bla svar 2'
        },
        {
            id: 2,
            answer: 'bla bla svar 3'
        },
        {
            id: 3,
            answer: 'blas ba svar 4'
        },
    ],
};

interface IOOptions {
    cors: {
        origin: string;
        methods: string[];
    };
    // Add other options if needed
}

function initializeSocket(server: HttpServer): Server {
    const ioOptions: IOOptions = {
        cors: config.cors
    }
    const io = new Server(server, ioOptions);
    const clients: Set < string > = new Set();
    const answers: Set < Answer > = new Set();
    let gameState: 'stopped' | 'starting' | 'started' = 'stopped';

    io.on('connection', (socket: Socket) => {
        clients.add(socket.id);
        socketLogger.log('New user connected. ID: ' + socket.id);
        io.emit('GameClientSync', Array.from(clients));

        socket.on('disconnect', () => {
            clients.delete(socket.id);
            socketLogger.log(`User ${socket.id} disconnected`);
            io.emit('GameClientSync', Array.from(clients));
        });

        socket.on('GameStartReq', () => {
            gameState = 'starting';
            socketLogger.log('Received GameStartReq, broadcasting GameStarting event to all clients.');
            io.emit('GameStarting');

            setTimeout(() => {
                gameState = 'started';
                socketLogger.log('Timeout elapsed, sending the first Question..');
                io.emit('GameQuestion', exampleQuestion);
            }, 5000);
        });

        socket.on('GameAnswer', (e: string) => {
            if (gameState !== 'started') return;

            socketLogger.log(`Received answer ${e} from ${socket.id}`);
            registerAnswer(socket, answers, e);

            if (answers.size >= clients.size) {
                socketLogger.log('All clients have now answered!');
                io.emit('GameResult', 1);
            }
        });
    });

    return io;
}

function registerAnswer(socket: Socket, answerSet: Set < Answer > , answerid: string) {
    const userid = socket.id;
    const answer: Answer = {
        userid,
        answerid
    };
    const set = JSON.stringify(answer);
    socketLogger.log('Hello from registerAnswer');

    // Check uniqueness, warn if not.
    if (!answerSet.has(answer)) {
        answerSet.add(answer);
    } else {
        socketLogger.warn(`${socket.id} attempted to answer, but has already answered this question.`);
    }
}

export = initializeSocket;