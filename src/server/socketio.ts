import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import { config } from '../utils/utils';
import { handleConnection, handleAnswer, handleDisconnect, joinOrCreateGame, startGame, getGameBySocket, KashootLobby, Question, } from '../game/game'
import Logger from '../utils/logger';

export enum Events {
    connection = 'connection',
    disconnect = 'disconnect',
    joinGame = 'joinGame',
    reqGameStart = 'gameStartReq',
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

    io.on(Events.connection, (socket: Socket) => {
        
        handleConnection(socket)
        socket.on(Events.disconnect, () => {
            const { room } = socket.data
            //If socket is in a room, remove it from it.
            if (room) {
                lobbies.get(room)?.leaveGame(socket.id)
            }
        });
        socket.on(Events.joinGame, (data) => {
            //Takes username and roomId as input.
            //TODO: add validation to make sure these are correct.
            const { username, roomCode } = data
            socket.data.room = roomCode //Used to associate socket to a room so they can be removed from a game if they leave prematurely.
            //Also intentionally limits socket to one room at a time. I don't see a scenario where a socket needs multiple rooms, so this seems like an easy solution.

            const lobby = lobbies.get(roomCode)

            //If lobby exists, add the user to it. If not, create a new room for it.
            if (lobby) {
                lobby.joinGame(socket.id, username)
            } else {
                const newLobby = createNewLobby()
                lobbies.set(roomCode, newLobby)
            }
        })
        socket.on(Events.reqGameStart, () => {
            socketLogger.log(`Got GameStartReq from ${socket.id}`)
            startGame(socket, io)
        });
        socket.on(Events.gameAnswer, (data) => {
            const {roomCode, answerId} = data
            const lobby = lobbies.get(roomCode)
            if (!lobby) return //TODO: Add an error here
            lobby.registerAnswer(socket.id,answerId)
        });
    })
    return io;
}
function createNewLobby(): KashootLobby {
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
    return new KashootLobby(Questions)
}

