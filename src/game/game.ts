import { type Server, Socket } from 'socket.io';
import { socketLogger } from '../server/socketio';

interface Client {
    username: string,
    ready: boolean,
    answers: Map<number, answerId> //questionId, answerId.
}
export interface Question {
    question: string;
    alternatives: string[];
    correctAnswerId: number;
}
interface answerId {
    answerId: 0|1|2|3
}
export class KashootLobby {
    currentRound: number;
    questions: Question[];
    clients: Map<string, Client>;  //key is socket instance's id.

    constructor(questions: Question[]) {
        this.currentRound = 0;
        this.questions = questions;
        this.clients = new Map();
    }
    public joinGame(userId: string, username: string): void {
        //adds the client to the game's client list. Warning: silently overwrites if uuid is already used.
        const client: Client = {
            username: username,
            ready: false,
            answers: new Map()
        }
        this.clients.set(userId, client)
    }
    public leaveGame(userId: string): void {
        this.clients.delete(userId)
    }
    public setReadyState(userId: string, ready: boolean) {
        const user = this.clients.get(userId)
        if (!user) return //return early if user does not exist. Shouldn't technically be needed since validation should be done before this step but oh well.
        user.ready = ready
    }
    public registerAnswer(userId: string, answerId: answerId): void {
        //finds the client by its userid and then adds it to the clients answers map.
        this.clients.get(userId)?.answers.set(this.currentRound, answerId)
    }

}



function handleAnswer(socket: Socket, data: number, io: Server) {
    const game = getGameBySocket(socket);
    if (game.gameState !== GameState.Running) {
        return socketLogger.warn(`${socket.id} tried to send answer before game started`);
    }

    const answer: Answer = { userId: socket.id, answer: data, roundId: game.currentRound };
    game.answers.add(answer);
    socketLogger.log(`${socket.id} answered question with ${data}`);

    const correctAnswer = game.questions[game.currentRound].correctAnswer;

    game.answers.forEach((ans) => {
        if (ans.roundId !== game.currentRound) return;

        const answerCorrect = ans.answer === correctAnswer;
        socketLogger.debug(`answer is... ${answerCorrect}`);

        const socket = getSocketById(ans.userId, io);
        socket?.emit(`question${answerCorrect ? 'C' : 'Inc'}orrect`);
    });

    if (++game.currentRound < game.questions.length) {
        startRound(socket, io);
    } else {
        endGame(socket, io);
    }
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
    const game = getGameBySocket(socket);
    if (game.gameState !== GameState.Stopped) return;

    game.gameState = GameState.Starting;
    emitGameState(socket, io, game);

    setTimeout(() => {
        game.gameState = GameState.Running;
        emitGameState(socket, io, game);
        startRound(socket, io);
    }, 1000);
}
function endGame(socket: Socket, io: Server) {
    socketLogger.log('game ended');
    const game = getGameBySocket(socket);
    game.gameState = GameState.Finished;
    emitGameState(socket, io, game);

    const winner = getWinner(game);
    if (winner) {
        socketLogger.log(`winner: ${winner}`);
        const winnerSocket = getSocketById(winner, io);
        if (!winnerSocket) return;
        broadcastToUsersRoom(winnerSocket, io, 'GameWin', winner);
    }

    // Remove the game roomID from activeGames list
    delete activeGames[game.roomId];
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

    answers.forEach((answer) => {
        const { roundId, userId, answer: userAnswer } = answer;
        const question = questions.find((q) => q.id === roundId);

        if (question && userAnswer === question.correctAnswer) {
            userScores[userId] = (userScores[userId] || 0) + 1;
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