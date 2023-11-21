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

// Initial (empty) hands
let playerHand = [];
let playerCards = [];
let playerHandValue = 0;
let dealerHand = [];
let dealerCards = [];
let dealerHandValue = 0;

// SHUFFLE function (Fisher-Yates shuffle)
function shuffle(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    return deck;
}

// DEAL function
let i = -1;

function deal(hand) {
    i++;
    const dealtCard = deck[i];
    hand.push(dealtCard);
}

// SHOW function
function show(hand) {
    const cards = hand.map((card) => {
        return Object.keys(card).toString();
    });

    return cards;
}

// SUM function
function sum(hand, cards) {
    const cardValues = hand.map((card) => {
        return parseInt(Object.values(card));
    });
    const handValue = cardValues.reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
    }, 0);

    return resolveAces(handValue, cards);
}

// RESOLVE ACES function
function resolveAces(handValue, cards) {
    if (handValue > 21) {
        const aceIndex = cards.findIndex((card) => card.includes('ace'));
        if (aceIndex !== -1) {
            handValue -= 10;
            let cardsWithoutAce = cards.toSpliced(aceIndex, 1);
            return resolveAces(handValue, cardsWithoutAce);
        }
    }

    return handValue;
}

// UPDATE CONSOLE function
function updateConsole() {
    console.log('------------------');
    console.log("Player's cards: " + playerCards);
    console.log("Player's score: " + playerHandValue);
    console.log("Dealer's cards: " + dealerCards);
    console.log("Dealer's score: " + dealerHandValue);
}

// TOGGLE HIT STAND BUTTON VISIBILITY function
function toggleHitStandButtonVisibility() {
    document.querySelector('.hitButton').classList.toggle('hidden');
    document.querySelector('.standButton').classList.toggle('hidden');
}

// Button click handlers
function handleHitClick() {
    deal(playerHand);
    playerCards = show(playerHand);
    playerHandValue = sum(playerHand, playerCards);
    updateConsole();

    if (playerHandValue > 21) {
        toggleHitStandButtonVisibility();
        resolvePlayerBust();
    }
}

function handleStandClick() {
    toggleHitStandButtonVisibility();
    resolveGame();
}

// Game resolution
function resolveBlackjack() {
    if (dealerHandValue === 21) {
        console.log('Game outcome: blackjack- draw');
    } else {
        console.log('Game outcome: blackjack- player wins');
    }
}

function resolvePlayerBust() {
    console.log('Game outcome: bust- dealer wins');
}

function resolveGame() {
    if (dealerHandValue < 17) {
        deal(dealerHand);
        dealerCards = show(dealerHand);
        dealerHandValue = sum(dealerHand, dealerCards);
        updateConsole();
        resolveGame();
    } else {
        if (dealerHandValue > 21) {
            console.log('Game outcome: dealer bust- player wins');
        } else {
            if (dealerHandValue > playerHandValue) {
                console.log('Game outcome: dealer wins');
            } else if (dealerHandValue < playerHandValue) {
                console.log('Game outcome: player wins');
            } else {
                console.log('Game outcome: draw');
            }
        }
    }
}

// Shuffle + initial deal
shuffle(deck);
deal(playerHand);
deal(dealerHand);
deal(playerHand);
deal(dealerHand);
playerCards = show(playerHand);
playerHandValue = sum(playerHand, playerCards);
dealerCards = show(dealerHand);
dealerHandValue = sum(dealerHand, dealerCards);
updateConsole();

if (playerHandValue === 21) {
    resolveBlackjack();
} else {
    toggleHitStandButtonVisibility();
}

// Event listeners
document.querySelector('.hitButton').addEventListener('click', handleHitClick);
document.querySelector('.standButton').addEventListener('click', handleStandClick);
