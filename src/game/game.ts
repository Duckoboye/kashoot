import { type Server, Socket } from 'socket.io';
import { socketLogger } from '../server/socket';

const activeGames: Record<string, Game> = {}

interface Question {
    question: string;
    answers: string[];
    correctAnswer: number;
    id: number;
}
interface Answer {
    userId: string;
    answer: string;
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
    answers: Set<Answer>;
}

function handleAnswer(socket: Socket, data: any, io: Server) {
    const game = getGameBySocket(socket)
    if (game.gameState !== 'running') return socketLogger.warn(`${socket.id} tried to send answer before game started`)
    const answer: Answer = { userId: socket.id, answer: data, roundId: game.currentRound }
    game.answers.add(answer)
    socketLogger.log(`${socket.id} answered question with ${data}`)

    let count = 0;
    game.answers.forEach((value) => {
        if (value.roundId === game.currentRound) count++
    })
    if (count >= game.clients.size)
        socketLogger.log(`all clients have answered, proceeding..`)
    // This checks whether answer is correct or not
    const { correctAnswer } = game.questions[game.currentRound]
    game.answers.forEach((ans) => {
        if (ans.roundId !== game.currentRound) return
        const answerMap = new Map()
        answerMap.set("Blue", 0)
        answerMap.set("Red", 1)
        answerMap.set("Yellow", 2)
        answerMap.set("Green", 3)
        const answerCorrect = answerMap.get(ans.answer) == correctAnswer
        socketLogger.debug(`answer is... ${answerCorrect}`)
        const socket = getSocketById(answer.userId, io)
        socket?.emit(`question${answerCorrect ? 'C' : 'Inc'}orrect`)
    })

    ++game.currentRound < game.questions.length ? startRound(socket, io) : endGame(socket, io) //This might genuinely be the most hacky code I've ever produced.
}
function joinOrCreateGame(socket: Socket, io: Server, roomId: string) {
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
            answers: new Set()
        }
    }

    const game = activeGames[roomId];

    //Make the socket join the room and add it to the game's internal list of clients.
    socket.join(roomId)
    game.clients.add(socket.id)
    socketLogger.log(`${socket.id} just connected to room ${roomId}`)
    emitGameState(socket, io, game)
}
function startGame(socket: Socket, io: Server) {
    const game = getGameBySocket(socket)
    if (game.gameState !== 'stopped')
        return //do not try to start two games at once. 

    game.gameState = 'starting';
    emitGameState(socket, io, game);

    setTimeout(() => {
        game.gameState = 'running';
        emitGameState(socket, io, game);
        startRound(socket, io);
    }, 1000);

}
function endGame(socket: Socket, io: Server) {
    socketLogger.log('game ended')
    const game = getGameBySocket(socket)
    game.gameState = 'finished';
    emitGameState(socket, io, game);
    socketLogger.log(`winner: ${getWinner(game)}`)
    /* pscode
    change gamestate to finished
    remove game roomid from activeGames list
    */
}
function startRound(socket: Socket, io: Server) {
    const game = getGameBySocket(socket)
    const { question } = game.questions[game.currentRound]
    broadcastToUsersRoom(socket, io, 'GameQuestion', question)
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
function emitGameState(socket: Socket, io: Server, game: Game) {
    broadcastToUsersRoom(socket, io, 'GameState', game.gameState)
}
function broadcastToUsersRoom(socket: Socket, io: Server, event: string, data: string) {
    const room = Array.from(socket.rooms)[1]
    io.to(room).emit(event, data)
}
function userHasGame(socket: Socket): boolean {
    return (socket.rooms.size > 0)
}
function getGameState(socket: Socket) {
    const game = getGameBySocket(socket)
    return game.gameState
}
function getSocketById(uid: string, io: Server) {
    return io.sockets.sockets.get(uid)
}
function calculateScores(game: Game): Record<string, number> {
    const { questions, answers } = game;
    const userScores: Record<string, number> = {};

    const answerMap = new Map() //By god please refactor this. This is a terrible implementation
        answerMap.set("Blue", 0)
        answerMap.set("Red", 1)
        answerMap.set("Yellow", 2)
        answerMap.set("Green", 3)

    // Iterate through each answer
    answers.forEach((answer) => {
        const question = questions.find((q) => q.id === answer.roundId);

        // Ensure the question exists and the answer is correct
        if (question && +answerMap.get(answer.answer) === question.correctAnswer) {
            if (!userScores[answer.userId]) {
                userScores[answer.userId] = 1;
            } else {
                userScores[answer.userId]++;
            }
        }
    });

    return userScores;
}
function getWinner(game: Game): string | null {
    const userScores = calculateScores(game);
    let maxScore = 0;
    let winner: string | null = null;

    Object.entries(userScores).forEach(([userId, score]) => {
        if (score > maxScore) {
            maxScore = score;
            winner = userId;
        }
    });

    return winner;
}

export { handleAnswer, joinOrCreateGame, startGame, endGame, handleConnection, handleDisconnect, userHasGame, getGameBySocket, getGameState }