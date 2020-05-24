import { h } from 'preact';
import { useState, useCallback } from 'preact/hooks';
import style from './style';

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
	const [player1Card, setPlayer1Card] = useState(EmptyCard);
	const [player2Card, setPlayer2Card] = useState(EmptyCard);
	const playPressed = useCallback(() => {
	});
	return (
		<div class={style.home}>
			<h1>Home</h1>
			<p>This is the Home component.</p>
			<CardImage card={player1Card} size="cardMedium" />
			<button onClick={playPressed}>Play</button>
			<CardImage card={player2Card} size="cardMedium" />
		</div>
	);
}

export default Home;
