import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import { config } from '../utils/utils';
import { KashootLobby, Question, AnswerId, GameState, Scoreboard, } from '../game/game'
import Logger from '../utils/logger';
export type Scorecard = { userId: string; username: string; score: number; }
export interface ServerToClientEvents {
    gameStart: (quizName: string) => void
    scoreboard: (scoreboard: Scorecard[]) => void
    gameWin: (winner: string | undefined) => void
    gameQuestion: (question: string, alternatives: string[]) => void
    questionCorrect: () => void
    questionIncorrect: () => void
    gameState: (gameState: GameState) => void
    playerList: (playerList: {
        username: string;
        isReady: boolean;
        id: string;
    }[]) => void
}
export interface ClientToServerEvents {
    joinGame: (username: string, roomCode: string) => void
    disconnecting: () => void
    gameStartReq: (roomCode: string) => void
    readyState: (roomCode: string, isReady: boolean) => void
    gameAnswer: (roomCode: string, answerId: number) => void
}
interface InterServerEvents { } //for some reason it doesn't work without this??

export const socketLogger = new Logger('socketio-server')

export const lobbies = new Map<string, KashootLobby>() //Uses lobby code as key, game as value. 

export function createSocketServer(httpServer: HttpServer) {

    const io = new Server<
        ClientToServerEvents,
        ServerToClientEvents,
        InterServerEvents
    >(httpServer, config);
    socketLogger.log('Ready!')
    io.on('connection', (socket) => {
        socketLogger.log(`User ${socket.id} connected`);
        socket.on('disconnecting', () => {
            socketLogger.log(`user ${socket.id} disconnected`)
            //If socket is in a room, remove it from it.
            const roomsArray = [...socket.rooms];
            roomsArray.forEach(room => {
                if (room !== socket.id) {
                    const lobby = lobbies.get(room)
                    if (!lobby) return
                    lobby.leaveGame(socket.id)
                    broadcastPlayerList(lobby)
                }
            })
        })
        socket.on('joinGame', (username, roomCode) => {
            //Takes username and roomId as input.
            //TODO: add validation to make sure these are correct.

            socket.join(roomCode)
            let lobby = lobbies.get(roomCode)

            //If lobby doesn't exist, create a new one.
            if (!lobby) {
                lobby = createNewLobby(roomCode)
                lobbies.set(roomCode, lobby)
            }
            socketLogger.log(`Joining ${socket.id} to room ${roomCode}`)
            lobby.joinGame(socket.id, username)
            broadcastPlayerList(lobby)
        })
        socket.on('gameStartReq', (roomCode) => {
            socketLogger.log(`Got GameStartReq from ${socket.id} for roomCode ${roomCode}`)
            const lobby = lobbies.get(roomCode)
            if (!lobby) return //Room doesn't exist, so return early.
            startGame(lobby)
        });
        socket.on('readyState', (roomCode, isReady) => {
            //sets the readyState of the socket's client.
            const room = lobbies.get(roomCode)
            if (!room) return
            const client = room.clients.get(socket.id)
            if (client) client.ready = isReady
            broadcastPlayerList(room)
        })
        socket.on('gameAnswer', (roomCode: string, answerId: number) => {
            //Validates that answerId is valid, then registers it.
            const lobby = lobbies.get(roomCode)
            if (!lobby) return
            if (answerId >= 0 && answerId <= 3) {
                lobby.registerAnswer(socket.id, answerId as AnswerId)
            }

            if (lobby.allClientsHaveAnswered()) {
                //Calculate results. Check if there are any more questions left. If there are, announce the results and then proceed onto next question.
                //If not, announce winner instead.
                sendQuestionResults(lobby)
                lobby.updateScoreboard()
                setTimeout(() => {
                    lobby.currentRound++
                    if (lobby.questionsRemaining()) {
                        broadcastScoreboard(lobby)
                        setTimeout(() => broadcastQuestion(lobby), 1000);
                    } else {
                        lobby.gameState = 'finished'
                        broadcastGameState(lobby)
                        io.to(lobby.roomCode).emit('gameWin', lobby.getWinner())
                    }
                }, 1000);

            }

        });
    })
    function broadcastPlayerList(lobby: KashootLobby) {
        const playerList = Array.from(lobby.clients.values()).map(client => ({
            username: client.username,
            isReady: client.ready,
            id: client.id
        }));
        io.to(lobby.roomCode).emit('playerList', playerList);
    }

    function broadcastScoreboard(lobby: KashootLobby) {
        const scoreboardArray = Array.from(lobby.scoreboard.entries()).map(([userId, score]) => {
            const client = lobby.clients.get(userId);
            if (client) { // This is probably not neccesary, but it doesn't hurt.
                return {
                    userId,
                    username: client.username,
                    score,
                };
            } else {
                return {
                    userId,
                    username: 'Anon', 
                    score,
                };
            }
        });
    
        io.to(lobby.roomCode).emit('scoreboard', scoreboardArray);
    }
    
    function broadcastGameState(lobby: KashootLobby) {
        io.to(lobby.roomCode).emit('gameState', lobby.gameState)
    }
    function startGame(lobby: KashootLobby) {
        socketLogger.log(`Starting game on lobby ${lobby.roomCode}`)
        lobby.GameState = 'running'
        broadcastGameState(lobby)
        io.to(lobby.roomCode).emit('gameStart', lobby.quizName)
        setTimeout(() => broadcastQuestion(lobby), 1000)
    }
    function broadcastQuestion(lobby: KashootLobby) {
        const question = lobby.questions[lobby.currentRound]

        io.to(lobby.roomCode).emit('gameQuestion', question.question, question.alternatives)
    }
    function createNewLobby(roomCode: string): KashootLobby {
        socketLogger.log('Creating new lobby with roomCode ' + roomCode)
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
        return new KashootLobby('testGame', Questions, roomCode)
    }
    async function sendQuestionResults(lobby: KashootLobby): Promise<void> {
        //gets all sockets in the lobby room and iterates over them to send them their results. Events.questionCorrect if correct, Events.questionincorrect if not.
        const room = io.to(lobby.roomCode)
        const sockets = await room.fetchSockets()

        for (const socket of sockets) {
            const result = lobby.checkAnsweredCorrectly(socket.id)
            socket.emit(result ? 'questionCorrect' : 'questionIncorrect')
        }
    }
    return io;
}
