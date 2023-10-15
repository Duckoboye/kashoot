import { Socket } from 'socket.io';
import { socketLogger } from '..';
import {io} from '../'

const activeGames: Record<string,Game> = {}

interface Question {
    question: string;
    answers: string[];
    correctAnswer: number;
    id: number;
}
interface Answer {
    userId: string;
    answer: string;
    questionId: number;
    roundId: number;
}
interface RoundResults {
    answer: string;
}
interface GameResults {
    // Placeholder
}
interface Game {
    roomId: string;
    gameState: 'stopped' | 'starting' | 'running' | 'finished';
    currentRound: number;
    questions: Question[];
    results: Record<number, RoundResults>;
    clients: Set<string>;
    answers: Answer[];
}

function handleAnswer(socket: Socket, roomId: any) {
    throw new Error('Function not implemented.');
    /*pscode
    game = getGameBySocket(socket)

    if game.gamestate != 'running'
    return

    validateAndRegisterAnswer()

    if answers.count === clients.count
    
    calculateRoundResults
    ++game.currentRound>game.questions.length?startRound():endGame()
    */
}
function joinOrCreateGame(socket: Socket, roomId: string) {
    if (!activeGames[roomId]) {
        activeGames[roomId] = {
            roomId,
            gameState: 'stopped',
            currentRound: 0,
            questions: [{
                question: 'What is the capital of France?',
                answers: ['Paris', 'London', 'Berlin', 'Rome'],
                correctAnswer: 0,
                id: 0,
            },
            {
                question: 'Which planet is known as the Red Planet?',
                answers: ['Mars', 'Earth', 'Jupiter', 'Venus'],
                correctAnswer: 0,
                id: 1,
            },
            {
                question: 'Who wrote the play "Romeo and Juliet"?',
                answers: ['William Shakespeare', 'Jane Austen', 'George Orwell', 'Charles Dickens'],
                correctAnswer: 0,
                id: 2,
            },
            {
                question: 'Which gas do plants absorb from the atmosphere?',
                answers: ['Carbon dioxide', 'Oxygen', 'Nitrogen', 'Hydrogen'],
                correctAnswer: 3,
                id: 3,
            },],
            results: {},
            clients: new Set(),
            answers: []
        }
    }

    const game = activeGames[roomId];
    
    //Make the socket join the room and add it to the game's internal list of clients.
    socket.join(roomId)
    game.clients.add(socket.id)
    socketLogger.log(`${socket.id} just connected to room ${roomId}`)
    emitGameState(socket, game)
}
function startGame(socket: Socket) {
    const game = getGameBySocket(socket)
    if (game.gameState !== 'stopped')
    return //do not try to start two games at once. 

    game.gameState = 'starting'
    emitGameState(socket,game)

    game.gameState = 'running'
    emitGameState(socket,game)
    startRound(socket, game)
}
function endGame(socket: Socket) {
    throw new Error('Function not implemented.');
    /* pscode
    change gamestate to finished
    remove game roomid from activeGames list
    */
}
function startRound(socket: Socket, game: Game) {
    const { question } = game.questions[game.currentRound]
    broadcastToUsersRoom(socket, 'GameQuestion',question)
}
function handleDisconnect(socket: Socket) {
    socketLogger.log(`User ${socket.id} disconnected`);
    // if user is part of a game, remove them from the game client list so the server won't wait for their answers
    if (socket.rooms.size > 0) {
    const game = getGameBySocket(socket)
    game.clients.delete(socket.id)
}
}
function handleConnection(socket: Socket) {
    socketLogger.log(`User ${socket.id} connected`);
}
function getGameBySocket(socket: Socket) {
    const room = Array.from(socket.rooms)[1]
    return activeGames[room]
}
function emitGameState(socket: Socket, game: Game) {
    broadcastToUsersRoom( socket, 'GameState',game.gameState)
}
function broadcastToUsersRoom( socket: Socket, event: string, data: string ) {
    const room = Array.from(socket.rooms)[1]
    io.to(room).emit(event,data)
}
function userHasGame(socket: Socket): boolean {
    return (socket.rooms.size > 0)
}

export {handleAnswer, joinOrCreateGame, startGame, endGame, handleConnection, handleDisconnect, userHasGame }