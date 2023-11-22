interface Question {
    question: string;
    answers: string[];
    correctAnswer: number;
    id: number;
}
interface Answer {
    userId: string;
    answer: number;
    roundId: number;
}
interface RoundResults {
    answer: string;
}
enum GameStates {
    Stopped = 'stopped',
    Starting = 'starting',
    Running = 'running',
    Finished = 'finished',
}

class Game {
    roomId: string;
    #gameState: GameStates;
    currentRound: number;
    questions: Question[];
    results: Record<number, RoundResults>;
    answers: Set<Answer>;

    constructor(roomId: string, questions: Question[]) {
        this.roomId = roomId;
        this.#gameState = GameStates.Stopped;
        this.currentRound = 0;
        this.questions = questions;
        this.results = {};
        this.answers = new Set();
    }

    registerAnswer(answer: Answer) {
        this.answers.add(answer)
    }
    get correctAnswer():number {
        return this.questions[this.currentRound].correctAnswer
    }
    get gameState():GameStates {
        return this.gameState
    }
    set gameState(newState: GameStates) {
        this.#gameState = newState
    }
    validateAnswer(answer: Answer) {
        //May or may not be implemented
        throw new Error('function not yet implemented');
    }
    calculateScores(game: Game): Record<string, number> {
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
    getWinner(game: Game): string | null {
        const userScores = this.calculateScores(game);
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
}