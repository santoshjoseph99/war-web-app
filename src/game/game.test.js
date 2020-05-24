const test = require('ava');
const {Game} = require('./game');
const {Card, Rank} = require('deckjs');

test('create game', t => {
  const game = new Game();
  t.pass();
});

test('compare equal rank cards', t => {
  const card1 = new Card(Rank.Ace);
  const card2 = new Card(Rank.Ace);
  const game = new Game();
  const result = game.compare(card1, card2);
  t.assert(result === 0);
});

test('compare card1 is > then card2', t => {
  const card1 = new Card(Rank.Ace);
  const card2 = new Card(Rank.King);
  const game = new Game();
  const result = game.compare(card1, card2);
  t.assert(result === 1);
});

test('compare card1 is < then card2', t => {
  const card1 = new Card(Rank.King);
  const card2 = new Card(Rank.Ace);
  const game = new Game();
  const result = game.compare(card1, card2);
  t.assert(result === -1);
});

test('play war: one card each, player1 wins', t => {
  const card1 = new Card(Rank.Ace);
  const card2 = new Card(Rank.King);
  const game = new Game();
  const player1Cards = [card1];
  const player2Cards = [card2];
  const result = game.play(player1Cards, player2Cards);
  t.assert(result.play === 'play');
  t.assert(result.player1.actions[0] === 'showcardup');
  t.assert(result.player1.cards[0].rank === Rank.Ace);
  t.assert(result.player2.actions[0] === 'showcardup');
  t.assert(result.player2.cards[0].rank === Rank.King);
  t.assert(player1Cards.length === 2);
  t.assert(player2Cards.length === 0);
  const endResult = game.play(player1Cards, player2Cards);
  t.assert(endResult.play === 'end');
  t.assert(endResult.player1.actions[0] === 'winner');
  t.assert(endResult.player2.actions[0] === 'loser');
});

test('play war: one card each, player2 wins', t => {
  const card1 = new Card(Rank.King);
  const card2 = new Card(Rank.Ace);
  const game = new Game();
  const player1Cards = [card1];
  const player2Cards = [card2];
  const result = game.play(player1Cards, player2Cards);
  t.assert(result.play === 'play');
  t.assert(result.player1.actions[0] === 'showcardup');
  t.assert(result.player1.cards[0].rank === Rank.King);
  t.assert(result.player2.actions[0] === 'showcardup');
  t.assert(result.player2.cards[0].rank === Rank.Ace);
  t.assert(player1Cards.length === 0);
  t.assert(player2Cards.length === 2);
  const endResult = game.play(player1Cards, player2Cards);
  t.assert(endResult.play === 'end');
  t.assert(endResult.player1.actions[0] === 'loser');
  t.assert(endResult.player2.actions[0] === 'winner');
});

test('play war: tie, player1 wins all cards and wins', t => {
  const game = new Game();
  const player1Cards = [
    new Card(Rank.King),
    new Card(Rank.Two),
    new Card(Rank.Three),
    new Card(Rank.Four),
    new Card(Rank.Ace),
  ];
  const player2Cards = [
    new Card(Rank.King),
    new Card(Rank.Five),
    new Card(Rank.Two),
    new Card(Rank.Three),
    new Card(Rank.Four),
  ];
  let result = game.play(player1Cards, player2Cards);
  t.assert(result.play === 'tie');
  t.assert(result.player1.actions[0] === 'showcardup');
  t.assert(result.player1.cards[0].rank === Rank.King);
  t.assert(result.player2.actions[0] === 'showcardup');
  t.assert(result.player2.cards[0].rank === Rank.King);
  t.assert(player1Cards.length === 4);
  t.assert(player2Cards.length === 4);
  result = game.play(player1Cards, player2Cards, result.tieCards);
  t.assert(result.play === 'play');
  t.assert(player1Cards.length === 10);
  t.assert(player2Cards.length === 0);
  result = game.play(player1Cards, player2Cards);
  t.assert(result.play === 'end');
  t.assert(result.player1.actions[0] === 'winner');
  t.assert(result.player2.actions[0] === 'loser');
});

test('play war: tie, player2 wins all cards and wins', t => {
  const game = new Game();
  const player1Cards = [
    new Card(Rank.King),
    new Card(Rank.Five),
    new Card(Rank.Two),
    new Card(Rank.Three),
    new Card(Rank.Four),
  ];
  const player2Cards = [
    new Card(Rank.King),
    new Card(Rank.Two),
    new Card(Rank.Three),
    new Card(Rank.Four),
    new Card(Rank.Ace),
  ];
  let result = game.play(player1Cards, player2Cards);
  t.assert(result.play === 'tie');
  t.assert(result.player1.actions[0] === 'showcardup');
  t.assert(result.player1.cards[0].rank === Rank.King);
  t.assert(result.player2.actions[0] === 'showcardup');
  t.assert(result.player2.cards[0].rank === Rank.King);
  t.assert(player1Cards.length === 4);
  t.assert(player2Cards.length === 4);
  result = game.play(player1Cards, player2Cards, result.tieCards);
  t.assert(result.play === 'play');
  t.assert(player1Cards.length === 0);
  t.assert(player2Cards.length === 10);
  result = game.play(player1Cards, player2Cards);
  t.assert(result.play === 'end');
  t.assert(result.player1.actions[0] === 'loser');
  t.assert(result.player2.actions[0] === 'winner');
});

test('play war: multiple ties, player1 wins', t => {
  const game = new Game();
  const player1Cards = [
    new Card(Rank.King),
    new Card(Rank.Two),
    new Card(Rank.Three),
    new Card(Rank.Four),
    new Card(Rank.Ace),
    new Card(Rank.Five),
    new Card(Rank.Six),
    new Card(Rank.Seven),
    new Card(Rank.Jack), //winner
  ];
  const player2Cards = [
    new Card(Rank.King), //first tie
    new Card(Rank.Eight),
    new Card(Rank.Nine),
    new Card(Rank.Ten),
    new Card(Rank.Ace), //second tie
    new Card(Rank.Queen),
    new Card(Rank.Jack),
    new Card(Rank.Jack),
    new Card(Rank.Ten),
  ];
  let result = game.play(player1Cards, player2Cards);
  t.assert(result.play === 'tie');
  t.assert(result.player1.actions[0] === 'showcardup');
  t.assert(result.player1.cards[0].rank === Rank.King);
  t.assert(result.player2.actions[0] === 'showcardup');
  t.assert(result.player2.cards[0].rank === Rank.King);
  t.assert(player1Cards.length === 8);
  t.assert(player2Cards.length === 8);
  result = game.play(player1Cards, player2Cards, result.tieCards);
  t.assert(result.play === 'tie');
  t.assert(player1Cards.length === 4);
  t.assert(player2Cards.length === 4);
  result = game.play(player1Cards, player2Cards, result.tieCards);
  t.assert(result.play === 'play');
  t.assert(player1Cards.length === 18);
  t.assert(player2Cards.length === 0);
  result = game.play(player1Cards, player2Cards);
  t.assert(result.play === 'end');
  t.assert(result.player1.actions[0] === 'winner');
  t.assert(result.player2.actions[0] === 'loser');
});

test('play war: tie and player1 runs out of cards and loses', t => {
  const game = new Game();
  const player1Cards = [
    new Card(Rank.King), //first tie
    new Card(Rank.Two),
    new Card(Rank.Three),
    new Card(Rank.Four),
    new Card(Rank.Ace), //second tie
    new Card(Rank.Five),
    new Card(Rank.Six),
  ];
  const player2Cards = [
    new Card(Rank.King), //first tie
    new Card(Rank.Eight),
    new Card(Rank.Nine),
    new Card(Rank.Ten),
    new Card(Rank.Ace), //second tie
    new Card(Rank.Queen),
    new Card(Rank.Jack),
    new Card(Rank.Jack),
    new Card(Rank.Ten), //winner
  ];
  let result = game.play(player1Cards, player2Cards);
  t.assert(result.play === 'tie');
  t.assert(result.player1.actions[0] === 'showcardup');
  t.assert(result.player1.cards[0].rank === Rank.King);
  t.assert(result.player2.actions[0] === 'showcardup');
  t.assert(result.player2.cards[0].rank === Rank.King);
  t.assert(player1Cards.length === 6);
  t.assert(player2Cards.length === 8);
  result = game.play(player1Cards, player2Cards, result.tieCards);
  t.assert(result.play === 'tie');
  t.assert(player1Cards.length === 2);
  t.assert(player2Cards.length === 4);
  result = game.play(player1Cards, player2Cards, result.tieCards);
  t.assert(result.play === 'play');
  t.assert(player1Cards.length === 0);
  t.assert(player2Cards.length === 16);
  result = game.play(player1Cards, player2Cards);
  t.assert(result.play === 'end');
  t.assert(result.player1.actions[0] === 'loser');
  t.assert(result.player2.actions[0] === 'winner');
});

test('play war: tie and player2 runs out of cards and loses', t => {
  const game = new Game();
  const player1Cards = [
    new Card(Rank.King), //first tie
    new Card(Rank.Eight),
    new Card(Rank.Nine),
    new Card(Rank.Ten),
    new Card(Rank.Ace), //second tie
    new Card(Rank.Queen),
    new Card(Rank.Jack),
    new Card(Rank.Jack),
    new Card(Rank.Ten), //winner
  ];
  const player2Cards = [
    new Card(Rank.King), //first tie
    new Card(Rank.Two),
    new Card(Rank.Three),
    new Card(Rank.Four),
    new Card(Rank.Ace), //second tie
    new Card(Rank.Five),
    new Card(Rank.Six),
  ];

  let result = game.play(player1Cards, player2Cards);
  t.assert(result.play === 'tie');
  t.assert(result.player1.actions[0] === 'showcardup');
  t.assert(result.player1.cards[0].rank === Rank.King);
  t.assert(result.player2.actions[0] === 'showcardup');
  t.assert(result.player2.cards[0].rank === Rank.King);
  t.assert(player1Cards.length === 8);
  t.assert(player2Cards.length === 6);
  result = game.play(player1Cards, player2Cards, result.tieCards);
  t.assert(result.play === 'tie');
  t.assert(player1Cards.length === 4);
  t.assert(player2Cards.length === 2);
  result = game.play(player1Cards, player2Cards, result.tieCards);
  t.assert(result.play === 'play');
  t.assert(player1Cards.length === 16);
  t.assert(player2Cards.length === 0);
  result = game.play(player1Cards, player2Cards);
  t.assert(result.play === 'end');
  t.assert(result.player1.actions[0] === 'winner');
  t.assert(result.player2.actions[0] === 'loser');
});

test('play war: uneven cards, player2 runs out and loses', t => {
  const game = new Game();
  const player1Cards = [
    new Card(Rank.King), //win
    new Card(Rank.Eight), //win
    new Card(Rank.Nine), //win game
    new Card(Rank.Ten),
  ];
  const player2Cards = [
    new Card(Rank.Queen),
    new Card(Rank.Two),
    new Card(Rank.Three),
  ];

  let result = game.play(player1Cards, player2Cards);
  t.assert(result.play === 'play');
  t.assert(result.player1.actions[0] === 'showcardup');
  t.assert(result.player1.cards[0].rank === Rank.King);
  t.assert(result.player2.actions[0] === 'showcardup');
  t.assert(result.player2.cards[0].rank === Rank.Queen);
  t.assert(player1Cards.length === 5);
  t.assert(player2Cards.length === 2);
  result = game.play(player1Cards, player2Cards);
  t.assert(result.play === 'play');
  t.assert(player1Cards.length === 6);
  t.assert(player2Cards.length === 1);
  result = game.play(player1Cards, player2Cards);
  t.assert(result.play === 'play');
  t.assert(player1Cards.length === 7);
  t.assert(player2Cards.length === 0);
  result = game.play(player1Cards, player2Cards);
  t.assert(result.play === 'end');
  t.assert(result.player1.actions[0] === 'winner');
  t.assert(result.player2.actions[0] === 'loser');
});