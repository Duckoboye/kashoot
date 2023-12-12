interface Client {
    username: string,
    ready: boolean,
    answers: Map<number, AnswerId>, //questionId, answerId.
    id: string
}
export interface Question {
    question: string;
    alternatives: string[];
    correctAnswerId: number;
}

export type AnswerId = 0 | 1 | 2 | 3;
export type GameState = 'stopped' | 'starting' | 'running' | 'finished'
type UserId = string

export class KashootLobby {
    currentRound: number;
    quizName: string;
    questions: Question[];
    clients: Map<UserId, Client>;  //key is socket instance's id.
    gameState: GameState;
    roomCode: string;
    scoreboard: Map<UserId, number>;

    constructor(quizName: string, questions: Question[], roomCode: string) {
        this.currentRound = 0;
        this.roomCode = roomCode;
        this.quizName = quizName
        this.questions = questions;
        this.clients = new Map();
        this.gameState = 'stopped'
        this.scoreboard = new Map();
    }
    public joinGame(userId: string, username: string): void {
        //adds the client to the game's client list. Warning: silently overwrites if uuid is already used.
        const client: Client = {
            username: username,
            ready: false,
            answers: new Map(),
            id: userId
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
    public registerAnswer(userId: string, answerId: AnswerId): void {
        //finds the client by its userid and then adds it to the clients answers map.
        this.clients.get(userId)?.answers.set(this.currentRound, answerId)
    }
    set GameState(state: GameState) {
        this.gameState = state
    }
    public allClientsHaveAnswered(): boolean {
        //Iterates over clients map and checks if any of them hasn't answered yet.
        for (const [, client] of this.clients) {
            if (!client.answers.has(this.currentRound)) {
                return false; // If any client doesn't have an answer for the current round, return false
            }
        }
        return true; // All clients have answered for the current round
    }
    updateScoreboard() {
        //Iterates over clients to see who answered correctly. If they did, they get an increase in their score. 
        const correctAnswerId: number = this.questions[this.currentRound].correctAnswerId
        for (const [userId, client] of this.clients) {
            if (client.answers.get(this.currentRound) === correctAnswerId) {
                const score: number = this.scoreboard.get(userId) || 0
                this.scoreboard.set(userId, score + 1)
            }
        }
    }
    checkAnsweredCorrectly(userId: UserId) {
        //gets the answer client submitted and checks it to the correct answer
        const answerId = this.clients.get(userId)?.answers.get(this.currentRound)
        return (answerId === this.questions[this.currentRound].correctAnswerId)
    }
    questionsRemaining(): boolean {
        return !(this.currentRound >= this.questions.length)
    }
    getWinner() {
        let highestScore = -Infinity; // Initialize highest score as lowest possible value
        let userWithHighestScore: string | undefined;

        for (const [userId, score] of this.scoreboard.entries()) {
            if (score > highestScore) {
                highestScore = score;
                userWithHighestScore = userId;
            }
        }

        return userWithHighestScore;
    }
    allClientsAreReady(): boolean {
            //Iterates over clients map and checks if any of them hasn't answered yet.
            for (const [, client] of this.clients) {
                if (!client.ready) {
                    return false; // If any client doesn't have an answer for the current round, return false
                }
            }
            return true; // All clients have answered for the current round
    }
}