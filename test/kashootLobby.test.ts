import { expect } from 'chai';
import { KashootLobby, Question } from '../src/game/game';

describe('KashootLobby', () => {
    let lobby: KashootLobby;
    const userId1 = 'user1';
    const userId2 = 'user2';
    const question1: Question = {
        question: 'What is 2 + 2?',
        alternatives: ['3', '4', '5', '6'],
        correctAnswerId: 1,
    };
    const question2: Question = {
        question: 'Which planet is closest to the sun?',
        alternatives: ['Venus', 'Earth', 'Mercury', 'Mars'],
        correctAnswerId: 2,
    };

    beforeEach(() => {
        lobby = new KashootLobby('Math Quiz', [question1, question2], 'ABCD');
        lobby.joinGame(userId1, 'User One');
        lobby.joinGame(userId2, 'User Two');
    });

    it('should correctly register user answers', () => {
        lobby.registerAnswer(userId1, 1);
        lobby.registerAnswer(userId2, 2);

        expect(lobby.clients.get(userId1)?.answers.get(lobby.currentRound)).to.equal(1);
        expect(lobby.clients.get(userId2)?.answers.get(lobby.currentRound)).to.equal(2);
    });

    it('should correctly check if all clients have answered', () => {
        lobby.registerAnswer(userId1, 1);

        expect(lobby.allClientsHaveAnswered()).to.equal(false);

        lobby.registerAnswer(userId2, 2);

        expect(lobby.allClientsHaveAnswered()).to.equal(true);
    });

    it('should correctly update the scoreboard', () => {
        lobby.registerAnswer(userId1, 1);
        lobby.registerAnswer(userId2, 2);

        lobby.updateScoreboard();

        expect(lobby.scoreboard.get(userId1)).to.equal(1);
        expect(lobby.scoreboard.get(userId2)).to.equal(undefined); //User did not respond with correct answer, therefore it shouldn't be listed in the scoreboard.
    });

    it('should correctly get the winner', () => {
        lobby.registerAnswer(userId1, 1);
        lobby.registerAnswer(userId2, 2);
        lobby.updateScoreboard();

        const winner = lobby.getWinner();
        expect(winner).to.be.oneOf([userId1, userId2]);
    });

    it('should correctly check if a client answered correctly', () => {
        lobby.registerAnswer(userId1, 1);
        lobby.registerAnswer(userId2, 2);

        expect(lobby.checkAnsweredCorrectly(userId1)).to.equal(true);
        expect(lobby.checkAnsweredCorrectly(userId2)).to.equal(false);
    });

    it('should correctly check if questions remain', () => {
        lobby.currentRound = 2; // Assuming we're at the second question
        expect(lobby.questionsRemaining()).to.equal(false);

        lobby.currentRound = 0;
        expect(lobby.questionsRemaining()).to.equal(true);
    });

    it('should return the winner based on the scoreboard', () => {
        lobby.scoreboard.set(userId1, 2);
        lobby.scoreboard.set(userId2, 1);

        const winner = lobby.getWinner();
        expect(winner).to.equal(userId1);
    });

    it('should not find a winner if the scoreboard is empty', () => {
        const winner = lobby.getWinner();
        expect(winner).to.equal(undefined);
    });

    it('should correctly check if all clients are ready', () => {
        expect(lobby.allClientsAreReady()).to.equal(false);
        //@ts-ignore
        lobby.clients.get(userId1).ready = true;
        //@ts-ignore
        lobby.clients.get(userId2).ready = true;
    
        expect(lobby.allClientsAreReady()).to.equal(true);
    });
    


});
