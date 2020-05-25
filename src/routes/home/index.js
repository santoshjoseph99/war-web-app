import { h } from 'preact';
import { useState, useCallback, useEffect, useContext } from 'preact/hooks';
import style from './style';
import GameContext from '../../components/gameContext';

const URL = 'https://sjcards.s3-us-west-1.amazonaws.com';

class Player {
	cards = [];
}

const EmptyCard = {
	faceUp: false,
	toLongString: () => ''
};

const CardImage = (props) => {
	const { card, size } = props;
	let cardTypeClass;
	if (size === 'cardSmall') {
		cardTypeClass = style.cardSmall;
	}
	else if (size === 'cardMedium') {
		cardTypeClass = style.cardMedium;
	}
	const src = card.faceUp ?
		`${URL}/${card.toShortString().toUpperCase()}.png` :
		`${URL}/yellow_back.png`;

	return (
		<img className={cardTypeClass} src={src} alt={`card ${card.toLongString()}`} />
	);
};

const Home = () => {
	const gameContext = useContext(GameContext);
	const [player1Card, setPlayer1Card] = useState(EmptyCard);
	const [player2Card, setPlayer2Card] = useState(EmptyCard);
	const [cards1, setCards1] = useState([]);
	const [cards2, setCards2] = useState([]);
	const [tieCards, setTieCards] = useState(null);
	const [gameOver, isGameOver] = useState(false);
	const [numHands, setNumHands] = useState(0);
	const onNewGame = useCallback(() => {
		const result = gameContext.game.newGame();
		setCards1(result.player1Cards);
		setCards2(result.player2Cards);
	}, [gameContext]);
	const onPlayPressed = useCallback(() => {
		setNumHands(numHands + 1);
		const result = gameContext.game.play(cards1, cards2, tieCards);
		console.log('play: ', result, cards1.length, cards2.length);
		if(result.play === 'tie') {
			setTieCards(result.tieCards);
		} else {
			setTieCards(null);
		}
		if(result.play === 'end') {
			isGameOver(!gameOver);
		}
		if(result.play === 'play') {
			setPlayer1Card(result.player1.cards[0]);
			setPlayer2Card(result.player2.cards[0]);
		}
	}, [gameContext, cards1, cards2, tieCards, numHands, gameOver]);
	useEffect(() => {
		const result = gameContext.game.newGame();
		setCards1(result.player1Cards);
		setCards2(result.player2Cards);
	}, [gameContext, setCards1, setCards2]);
	return (
		<div class={style.home}>
			<h1>Home</h1>
			<p>This is the Home component.</p>
			<div>
				<button onClick={onNewGame} disabled={!gameOver}>New Game</button>
			</div>
			<CardImage card={player1Card} size="cardMedium" />
			<CardImage card={player2Card} size="cardMedium" />
			<button onClick={onPlayPressed} disabled={gameOver}>Play</button>
		</div>
	);
}

export default Home;
