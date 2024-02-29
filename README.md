# Kashoot

## Getting started

### 1. npm
Make sure npm is installed by running `npm -v`. If npm isn't installed, you must install it using your package manager of choice. (Ex. Pacman, dnf, apt)
Example output: 

```
$ npm -v
10.2.3
```

### 2. Install required libraries

```
# for backend
npm install

#webui (only required if you intend to use the webui)
npm install --prefix client
```

### 3. Run the app in development mode

(Note: there is currently no way to automatically run the app in production mode.)

```
npm run start
```

If everything is done correctly, the server should be exposed on <http://localhost:3000>

## API

### Server-to-Client Events

#### gameStart

* Description: Signals the start of a game.
* Parameters:
    * quizName (string): The name of the quiz/game.
* Example:

```typescript
socket.on('gameStart', (quizName: string) => {
    // Handle game start event
});
```

#### scoreboard

* Description: Sends the current scoreboard to clients.
* Parameters:
    * scoreboard (Scorecard[]): Array containing score information for each player.
* Example:

```typescript
socket.on('scoreboard', (scoreboard: Scorecard[]) => {
    // Handle scoreboard update event
});
```

#### gameWin

* Description: Indicates the winner of the game.
* Parameters:
    * winner (string | undefined): Username of the winner, or undefined if no winner.
* Example:

```typescript
socket.on('gameWin', (winner: string | undefined) => {
    // Handle game win event
});
```

#### gameQuestion

* Description: Sends a game question and its alternatives to clients.
* Parameters:
    * question (string): The question text.
    alternatives (string[]): Array of alternative answers.
* Example:

```typescript
socket.on('gameQuestion', (question: string, alternatives: string[]) => {
    // Handle game question event
});
```

#### questionCorrect

* Description: Signals that a player answered a question correctly.
* Parameters: None
* Example:

```typescript
socket.on('questionCorrect', () => {
    // Handle correct answer event
});
```

#### questionIncorrect

* Description: Signals that a player answered a question incorrectly.
* Parameters: None
* Example:

```typescript

socket.on('questionIncorrect', () => {
    // Handle incorrect answer event
});
```
#### gameState

* Description: Sends the current state of the game to clients.
* Parameters:
    * gameState (GameState): The state of the game.
* Example:

```typescript

socket.on('gameState', (gameState: GameState) => {
    // Handle game state update event
    });
```

#### playerList

* Description: Sends the list of players in the game lobby to clients.
* Parameters:
    playerList (Player[]): Array containing player information.
* Example:

```typescript
socket.on('playerList', (playerList: Player[]) => {
    // Handle player list update event
});
```


### Client-to-Server Events

#### joinGame

* Description: Informs the server that a client is joining a game.
* Parameters:
    * username (string): Username of the client.
    * roomCode (string): Code of the room/game.
* Example:

```typescript
    socket.emit('joinGame', username: string, roomCode: string) => {
        // Handle join game event
    });
```

#### disconnecting

* Description: Informs the server that a client is disconnecting.
* Parameters: None
* Example:

```typescript
    socket.emit('disconnecting', () => {
        // Handle disconnecting event
    });
```

#### gameStartReq

* Description: Requests the server to start a game.
* Parameters:
    * roomCode (string): Code of the room/game.
* Example:

```typescript
    socket.emit('gameStartReq', roomCode: string) => {
        // Handle game start request event
    });
```
#### readyState

* Description: Informs the server about the ready state of a client.
* Parameters:
    * roomCode (string): Code of the room/game.
    * isReady (boolean): Ready state of the client.
* Example:

```typescript
    socket.emit('readyState', roomCode: string, isReady: boolean) => {
        // Handle ready state update event
    });
```

#### gameAnswer

* Description: Sends the chosen answer of a client to the server.
* Parameters:
    * roomCode (string): Code of the room/game.
    * answerId (number): ID of the chosen answer.
* Example:

```typescript
socket.emit('gameAnswer', roomCode: string, answerId: number) => {
    // Handle game answer event
});
```