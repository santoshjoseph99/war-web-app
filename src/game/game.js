import { Deck } from "deckjs";

export class Game {
  constructor() {
    this.deck = new Deck(1);
  }
  /// public
  compare(card1, card2) {
    if (card1.getValue() > card2.getValue()) {
      return 1;
    } else if (card1.getValue() < card2.getValue()) {
      return -1;
    }
    return 0;
  }

  /// public
  newGame() {
    this.deck.init(1, 0);
    this.deck.shuffle();
    const cards1 = [], cards2 = [];
    for(let i = 0; i < 26; i++) {
      cards1.push(this.deck.getCard());
    }
    for(let i = 0; i < 26; i++) {
      cards2.push(this.deck.getCard());
    }
    return {
      player1Cards: cards1,
      player2Cards: cards2
    };
  }

  createWinner(winner) {
    return {
      play: 'end',
      player1: {
        actions: [winner === 'player1' ? 'winner' : 'loser']
      },
      player2: {
        actions: [winner === 'player1' ? 'loser' : 'winner']
      }
    };
  }

  init() {
    return {
      play: '',
      tieCards: [],
      player1: {
        actions: [],
        cards: [],
      },
      player2: {
        actions: [],
        cards: [],
      }
    };
  }
  
  addPlayerCards(cards, player, tieCards) {
    const len = cards.length < 4 ? cards.length - 1 : 3;
    for (let i = 0; i < len; i++) {
      player.actions.push('showcarddown');
      const c = cards.shift();
      player.cards.push(c);
      tieCards.push(c);
    }
    player.actions.push('showcardup');
    const c1 = cards.shift();
    player.cards.push(c1);
    tieCards.push(c1);
  }

  addCompareResult(result, cards, tieCards) {
    const len1 = result.player1.cards.length;
    for (let i = 0; i < len1; i++){
      cards.push(result.player1.cards[i]);
    }
    const len2 = result.player2.cards.length;
    for (let i = 0; i < len2; i++){
      cards.push(result.player2.cards[i]);
    }
    for (let i = 0; i < tieCards.length; i++) {
      cards.push(tieCards[i]);
    }
  }
  
  handleTie(cards1, cards2, tieCards) {
    const result = this.init();
    const tieCards1 = [];
    const tieCards2 = [];

    this.addPlayerCards(cards1, result.player1, tieCards1);
    this.addPlayerCards(cards2, result.player2, tieCards2);

    const compareResult = this.compare(
      result.player1.cards[result.player1.cards.length - 1],
      result.player2.cards[result.player2.cards.length - 1]
    );

    if (compareResult === 1) {
      this.addCompareResult(result, cards1, tieCards);
       result.play = 'play';
    } else if (compareResult === -1) {
      this.addCompareResult(result, cards2, tieCards);
      result.play = 'play';
    } else {
      result.play = 'tie';
      result.tieCards = tieCards.concat(tieCards1, tieCards2);
    }
    return result;
  }

  handleNormal(cards1, cards2) {
    const result = this.init();
    const card1 = cards1.shift();
    const card2 = cards2.shift();
    result.player1.actions.push('showcardup');
    result.player1.cards.push(card1);
    result.player2.actions.push('showcardup');
    result.player2.cards.push(card2);
    const compareResult = this.compare(card1, card2);
    if (compareResult === 1) {
      cards1.push(card1);
      cards1.push(card2);
      result.play = 'play';
    } else if (compareResult === -1) {
      cards2.push(card1);
      cards2.push(card2);
      result.play = 'play';
    } else if (compareResult === 0) {
      result.play = 'tie';
      result.tieCards = [card1, card2];
    }
    return result;
  }

  /// public
  play(cards1, cards2, tieCards) {
    if (cards1.length === 0) {
      return this.createWinner('player2');
    }
    if (cards2.length === 0) {
      return this.createWinner('player1');
    }

    if (tieCards) {
      return this.handleTie(cards1, cards2, tieCards);
    }

    return this.handleNormal(cards1, cards2);
  }
}
