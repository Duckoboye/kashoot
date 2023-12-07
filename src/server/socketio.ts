import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import { config } from '../utils/utils';
import { handleConnection, handleAnswer, handleDisconnect, joinOrCreateGame, startGame, getGameBySocket, KashootLobby, Question, AnswerId, } from '../game/game'
import Logger from '../utils/logger';

export enum Events {
    connection = 'connection',
    disconnect = 'disconnect',
    disconnecting = 'disconnecting',
    joinGame = 'joinGame',
    reqGameStart = 'gameStartReq',
    gameStart = 'gameStart',
    gameAnswer = 'gameAnswer',
    gameState = 'gameState',
    getGameState = 'getGameState',
    gameQuestion = 'gameQuestion',
    questionCorrect = 'questionCorrect',
    questionIncorrect = 'questionIncorrect',
    gameWin = 'gameWin'
}

export const socketLogger = new Logger('socketio-server')

export function createSocketServer(httpServer: HttpServer) {
    //TODO: Move this somewhere more suitable later pls.
    const lobbies = new Map<string, KashootLobby>() //Uses lobby code as key, game as value. 

    const io = new Server(httpServer, config);
    socketLogger.log('Ready!')

    function startGame(lobby: KashootLobby) {
        lobby.GameState = 'running'
            io.to(lobby.roomCode).emit(Events.gameStart, lobby.quizName)
    }
    function broadcastQuestion(lobby: KashootLobby) {
        const question = lobby.questions[lobby.currentRound]

        //To make sure we don't send the correct answer id
        const toSend = {
            question: question.question,
            alternatives: question.alternatives
        }
        io.to(lobby.roomCode).emit(Events.gameQuestion, toSend)
    }

    io.on(Events.connection, (socket: Socket) => {
        handleConnection(socket)
        socket.on(Events.disconnecting, () => {
        //If socket is in a room, remove it from it.
            for (const room in socket.rooms.values) {
                if (room !== socket.id) {
                    lobbies.get(room)?.leaveGame(socket.id)
                  }
            }
        })
        socket.on(Events.disconnect, () => {
            
        });
        socket.on(Events.joinGame, (data) => {
            //Takes username and roomId as input.
            //TODO: add validation to make sure these are correct.
            const { username, roomCode } = data

            const lobby = lobbies.get(roomCode)

            //If lobby exists, add the user to it. If not, create a new room for it.
            if (lobby) {
                lobby.joinGame(socket.id, username)
            } else {
                const newLobby = createNewLobby(roomCode)
                lobbies.set(roomCode, newLobby)
            }
        })
        socket.on(Events.reqGameStart, (roomCode) => {
            socketLogger.log(`Got GameStartReq from ${socket.id}`)
            const lobby = lobbies.get(roomCode)
            if (!lobby) return //Room doesn't exist, so return early. 
            startGame(lobby)
        });
        socket.on(Events.gameAnswer, (data: {roomCode: string, answerId: number}) => {
            //Validates that answerId is valid, then registers it.
            const {roomCode, answerId} = data
            const lobby = lobbies.get(roomCode)
            if (answerId >= 0 && answerId <= 3) {
                lobby?.registerAnswer(socket.id, answerId as AnswerId)
            }
            
        });
    })
    return io;
}
function createNewLobby(roomCode: string): KashootLobby {
    const Questions: Question[] = [
        {
          question: 'What is the capital of France?',
          alternatives: ['Paris', 'London', 'Berlin', 'Rome'],
          correctAnswerId: 0,
        },
        {
          question: 'Which planet is known as the Red Planet?',
          alternatives: ['Mars', 'Jupiter', 'Venus', 'Saturn'],
          correctAnswerId: 0,
        },
        {
          question: 'What is the largest mammal?',
          alternatives: ['Elephant', 'Blue whale', 'Giraffe', 'Hippopotamus'],
          correctAnswerId: 1,
        },
        // Add more questions here
      ];
    return new KashootLobby('testGame',Questions, roomCode)
}

