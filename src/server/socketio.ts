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
                const newLobby = createNewLobby()
                lobbies.set(roomCode, newLobby)
            }
        })
        socket.on(Events.reqGameStart, () => {
            socketLogger.log(`Got GameStartReq from ${socket.id}`)
            startGame(socket, io)
        });
        socket.on(Events.gameAnswer, (answer: string) => {
            const answerNum = Number(answer)
            if (answerNum >= 0 && answerNum <= 3) {
                const answerId: AnswerId = answerNum as AnswerId;
                for (const room in socket.rooms.values) {
                    if (room !== socket.id) {
                        lobbies.get(room)?.registerAnswer(socket.id,answerId) //This implementation is slightly flawed, since if hypothetically a socket is connected to multiple rooms, this will send answers to all rooms at once. 
                      }
                }
            }
            
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

