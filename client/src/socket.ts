import { io, type Socket } from 'socket.io-client';

const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:5000';

export interface Player {
  username: string;
  isReady: boolean;
  id: string;
}
export interface Question {
  question: string;
  alternatives: string[]
}

export type GameState = 'stopped' | 'starting' | 'running' | 'finished'
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

// @ts-ignore
export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(URL);