// Unshuffled deck
let deck = [
    { twoClubs: 2 },
    { threeClubs: 3 },
    { fourClubs: 4 },
    { fiveClubs: 5 },
    { sixClubs: 6 },
    { sevenClubs: 7 },
    { eightClubs: 8 },
    { nineClubs: 9 },
    { tenClubs: 10 },
    { jackClubs: 10 },
    { queenClubs: 10 },
    { kingClubs: 10 },
    { aceClubs: 11 },
    { twoDiamonds: 2 },
    { threeDiamonds: 3 },
    { fourDiamonds: 4 },
    { fiveDiamonds: 5 },
    { sixDiamonds: 6 },
    { sevenDiamonds: 7 },
    { eightDiamonds: 8 },
    { nineDiamonds: 9 },
    { tenDiamonds: 10 },
    { jackDiamonds: 10 },
    { queenDiamonds: 10 },
    { kingDiamonds: 10 },
    { aceDiamonds: 11 },
    { twoHearts: 2 },
    { threeHearts: 3 },
    { fourHearts: 4 },
    { fiveHearts: 5 },
    { sixHearts: 6 },
    { sevenHearts: 7 },
    { eightHearts: 8 },
    { nineHearts: 9 },
    { tenHearts: 10 },
    { jackHearts: 10 },
    { queenHearts: 10 },
    { kingHearts: 10 },
    { aceHearts: 11 },
    { twoSpades: 2 },
    { threeSpades: 3 },
    { fourSpades: 4 },
    { fiveSpades: 5 },
    { sixSpades: 6 },
    { sevenSpades: 7 },
    { eightSpades: 8 },
    { nineSpades: 9 },
    { tenSpades: 10 },
    { jackSpades: 10 },
    { queenSpades: 10 },
    { kingSpades: 10 },
    { aceSpades: 11 }
];

// SHUFFLE function (Fisher-Yates shuffle)
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// DEAL function
let i = -1;

function deal() {
    i++;
    return deck[i];
}

// SHOW function
function show(cards) {
    const hand = cards.map((card) => {
        return Object.keys(card).toString();
    });

    return hand;
}

// SUM function
function sum(cards) {
    const cardValues = cards.map((card) => {
        return parseInt(Object.values(card));
    });
    const handValue = cardValues.reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
    }, 0);

    return resolveAces(handValue, show(cards));
}

// RESOLVE ACES function
function resolveAces(handValue, hand) {
    if (handValue > 21) {
        const aceIndex = hand.findIndex(card => card.includes('ace'));
        if (aceIndex !== -1) {
            handValue -= 10;
            hand.splice(aceIndex, 1);
            return resolveAces(handValue, hand);
        }
    }

    return handValue;
}

// Shuffle + initial deal
shuffle(deck);

let playerCards = [deal(), deal()];
let dealerCards = [deal(), deal()];

console.log("Player's cards: " + show(playerCards));
console.log("Player's score: " + sum(playerCards));
console.log("Dealer's cards: " + show(dealerCards));
console.log("Dealer's score: " + sum(dealerCards));

if (sum(playerCards) < 21) {
    document.querySelector('.hitButton').classList.remove('hidden');
    document.querySelector('.standButton').classList.remove('hidden');
} else {
    if (sum(dealerCards) === 21) {
        console.log('Game outcome: blackjack- draw')
    } else {
        console.log('Game outcome: blackjack- player wins')
    }
}