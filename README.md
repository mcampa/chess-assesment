# Very simple Chess API
A very simple chess REST API where only pawns are implemented. Using Node, Typescript, Express, MongoDB & Mongoose.
(Also a VanillaJS™ super simple dumb client is included).

## Files
```python
index.ts # Initial entry point, loads DB and server
GamePlay.ts # The main logic of the game is here
api.ts # all API endpoints are here
helpers # helper functions
models.ts # mongoose model for the game
```

## API Endpoints
```python
POST /games
# Creates a new chess game

GET /api/games/:gameId
# Fetches a game’s current state

GET /api/games/:gameId/moves/:position
# Fetch potential, valid spaces to which a piece could move from its current position

POST /api/games/:gameId/moves
# Update the game-state with a new move

GET /api/games/:gameId/history
# Fetch the history of all moves in a game (NOT IMPLEMENTED)
```

## Client
The client is just a html file with some minimal CSS and simple JS that consumes the API to render the board (don't judge me on this one).

When the user visits the root path (/) it will create a new game and redirect to /:game so it keeps the state of the game if the browser is refreshed.


## Usage
```
npm install
npm run dev
Open http://localhost:3000/
```