import { h } from 'preact';
import { useState, useCallback, useEffect, useContext } from 'preact/hooks';
import style from './style';
import GameContext from '../../components/gameContext';

const URL = 'https://sjcards.s3-us-west-1.amazonaws.com';

// class Player {
// 	cards = [];
// }

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

// const CardTieImages = (props) => {
// 	const {cards} = props;
// 	const downCards = cards.filter(c => !c.faceUp);
// 	const upCard = cards.filter(c => c.faceUp);

// 	return (
// 		<div>
// 			{downCards.map(() => 
// 				<img className={'cardSmall'} src={`${URL}/yellow_back.png`} alt={'card face down'} />)
// 			}
// 			<img className={'cardSmall'} src={`${URL}/${upCard.toShortString().toUpperCase()}.png`}
// 					 alt={`card ${upCard.toLongString()}`} />
// 		</div>
// 	);
// };

const getCardUp = (cards) => {
	return cards[cards.length - 1];
}

const getNumCardsWon = (result) => {
	return result.player1.cards.length + result.player2.cards.length;
}

const Home = () => {
	const gameContext = useContext(GameContext);
	const [player1Card, setPlayer1Card] = useState(EmptyCard);
	const [player2Card, setPlayer2Card] = useState(EmptyCard);
	const [cards1, setCards1] = useState([]);
	const [cards2, setCards2] = useState([]);
	const [tieCards, setTieCards] = useState(null);
	const [gameOver, isGameOver] = useState(false);
	const [numHands, setNumHands] = useState(0);
	const [gamesPlayed, setGamesPlayed] = useState(0);
	const [gameResult, setGameResult] = useState('');

	const onNewGame = useCallback(() => {
		const result = gameContext.game.newGame();
		setCards1(result.player1Cards);
		setCards2(result.player2Cards);
		setGamesPlayed(gamesPlayed + 1);
		setPlayer1Card(EmptyCard);
		setPlayer2Card(EmptyCard);
	}, [gameContext, gamesPlayed]);

	const onPlayPressed = useCallback(() => {
		setNumHands(numHands + 1);
		const result = gameContext.game.play(cards1, cards2, tieCards);
		console.log('play: ', result, cards1.length, cards2.length);
		if(result.play === 'tie') {
			setTieCards(result.tieCards);
			setGameResult('tie! Ready to play WAR!');
			const c1 = getCardUp(result.player1.cards);
			const c2 = getCardUp(result.player2.cards);
			setPlayer1Card(c1);
			setPlayer2Card(c2);
		} else {
			setTieCards(null);
		}
		if(result.play === 'end') {
			isGameOver(!gameOver);
			setGameResult(`GAME OVER! 
				${result.player1.actions[0] === 'winner' ? 'player 1 wins' : 'player 2 wins'}`);
		}
		if(result.play === 'play') {
			const c1 = getCardUp(result.player1.cards);
			const c2 = getCardUp(result.player2.cards);
			setPlayer1Card(c1);
			setPlayer2Card(c2);
			const compareResult = gameContext.game.compare(c1, c2);
			const compareResultStr = compareResult === 1 ? 'player 1 wins ' : 'player 2 wins ';
			setGameResult(`${compareResultStr} ${getNumCardsWon(result)} cards`);
		}
	}, [gameContext, cards1, cards2, tieCards, numHands, gameOver]);
	
	useEffect(() => {
		const result = gameContext.game.newGame();
		setCards1(result.player1Cards);
		setCards2(result.player2Cards);
	}, [gameContext, setCards1, setCards2]);

	return (
		<div class={style.home}>
			<div class={style.newGameContainer}>
				<button class={style.button} onClick={onNewGame}>New Game</button>
			</div>
			<div class={style.stats}>
				<p>Stats: Games: {gamesPlayed} Hands: {numHands}</p>
				<p># player 1 cards: {cards1.length}</p>
				<p># player 2 cards: {cards2.length}</p>
			</div>
			<div class={style.cardContainer}>
				<p>Player 1</p>
				<CardImage card={player1Card} size="cardMedium" />
			</div>
			<div class={style.cardContainer}>
				<p>Player 2</p>
				<CardImage card={player2Card} size="cardMedium" />
			</div>
			<div>
				<button class={"button button-outline"} onClick={onPlayPressed} disabled={gameOver}>Play</button>
			</div>
			<div class={style.gameResult}>
				<p>Result: {gameResult}</p>
			</div>
			{/* <div class={style.tieResults}>
				{tieCards ? "TIE RESULTS: todo" : ""}
			</div> */}
		</div>
	);
}

export default Home;
