import { Game } from '../game/game';
import { createContext } from 'preact';

const GameContext = createContext({ game: new Game() });

export default GameContext;