// GLOBAL VARS //

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

let bank = 1000;
let bet = 0;

// Initial (empty) hands
let player = { hand: [], cards: [], handValue: 0 };
let dealer = { hand: [], cards: [], handValue: 0 };

// FUNCTIONS //

// Shuffle (Fisher-Yates shuffle)
function shuffle(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    return deck;
}

// Deal
let i = -1;

function deal(person) {
    i++;
    const dealtCard = deck[i];
    person.hand.push(dealtCard);
    person.cards = updateCards(person);
    person.handValue = updateHandValue(person);
}

function updateCards(person) {
    const cards = person.hand.map((card) => {
        return Object.keys(card).toString();
    });
    return cards;
}

function updateHandValue(person) {
    const cardValues = person.hand.map((card) => {
        return parseInt(Object.values(card));
    });
    const handValue = cardValues.reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
    }, 0);

    return resolveAces(handValue, person);
}

function resolveAces(handValue, person) {
    if (handValue > 21) {
        const aceIndex = person.cards.findIndex((card) => card.includes('ace'));
        if (aceIndex !== -1) {
            handValue -= 10;
            let cardsWithoutAce = person.cards.toSpliced(aceIndex, 1);
            return resolveAces(handValue, cardsWithoutAce);
        }
    }

    return handValue;
}

// Update console
function updateConsole() {
    console.log('------------------');
    console.log("Player's cards: " + player.cards);
    console.log("Player's score: " + player.handValue);
    console.log("Dealer's cards: " + dealer.cards);
    console.log("Dealer's score: " + dealer.handValue);
}

// Toggle button visibility
function toggleHitStandButtonVisibility() {
    document.querySelector('.hitButton').classList.toggle('hidden');
    document.querySelector('.standButton').classList.toggle('hidden');
}

// Event handlers
function handleBetSubmit(e) {
    e.preventDefault();
    const bet = document.querySelector('#bet');
    console.log(bet.value);
}

function handleHitClick() {
    deal(player);
    updateConsole();

    if (player.handValue > 21) {
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
    if (dealer.handValue === 21) {
        console.log('Game outcome: blackjack- draw');
    } else {
        console.log('Game outcome: blackjack- player wins');
    }
}

function resolvePlayerBust() {
    console.log('Game outcome: bust- dealer wins');
}

function resolveGame() {
    if (dealer.handValue < 17) {
        deal(dealer);
        updateConsole();
        resolveGame();
    } else {
        if (dealer.handValue > 21) {
            console.log('Game outcome: dealer bust- player wins');
        } else {
            if (dealer.handValue > player.handValue) {
                console.log('Game outcome: dealer wins');
            } else if (dealer.handValue < player.handValue) {
                console.log('Game outcome: player wins');
            } else {
                console.log('Game outcome: draw');
            }
        }
    }
}

// GAMEPLAY //

// Shuffle + initial deal
shuffle(deck);
deal(player);
deal(dealer);
deal(player);
deal(dealer);
updateConsole();

if (player.handValue === 21) {
    resolveBlackjack();
} else {
    toggleHitStandButtonVisibility();
}

// Event listeners
document.querySelector('.bet').addEventListener('submit', handleBetSubmit);
document.querySelector('.hitButton').addEventListener('click', handleHitClick);
document.querySelector('.standButton').addEventListener('click', handleStandClick);
