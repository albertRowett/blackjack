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

let currentCard = -1;

// Initial (empty) hands
let player = { hand: [], cards: [], handValue: 0, wallet: 1000, bet: 0 };
let dealer = { hand: [], cards: [], handValue: 0 };

// Event listeners
document.querySelector('.betForm').addEventListener('submit', handleBetSubmit);
document.querySelector('.hitButton').addEventListener('click', handleHitClick);
document.querySelector('.standButton').addEventListener('click', handleStandClick);

// Event handlers
function handleBetSubmit(e) {
    e.preventDefault();
    const bet = document.querySelector('#bet').value;
    handleBet(bet, player);
    toggleBetFormVisibility();
    startRound();
}

function handleBet(bet, player) {
    player.bet = bet;
    player.wallet -= bet;
    console.log('Bet: ' + player.bet);
    console.log('Wallet: ' + player.wallet);
}

function handleHitClick() {
    deal(player);
    updateConsole();

    if (player.handValue > 21) {
        toggleHitStandButtonVisibility();
        resolvePlayerBust();
    } else if (player.handValue === 21) {
        toggleHitStandButtonVisibility();
        resolveRound();
    }
}

function handleStandClick() {
    toggleHitStandButtonVisibility();
    resolveRound();
}

// Button visibility toggling
function toggleHitStandButtonVisibility() {
    document.querySelector('.hitButton').classList.toggle('hidden');
    document.querySelector('.standButton').classList.toggle('hidden');
}

function toggleBetFormVisibility() {
    document.querySelector('.betForm').classList.toggle('hidden');
}

// Gameplay
function startRound() {
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
}

function shuffle(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    return deck;
}

function deal(person) {
    currentCard++;
    const dealtCard = deck[currentCard];
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

    return resolveAces(handValue, person.cards);
}

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

function updateConsole() {
    console.log('------------------');
    console.log("Player's cards: " + player.cards);
    console.log("Player's score: " + player.handValue);
    console.log("Dealer's cards: " + dealer.cards);
    console.log("Dealer's score: " + dealer.handValue);
}

// Round resolution
function resolveBlackjack() {
    if (dealer.handValue === 21) {
        console.log('Round outcome: blackjack- draw');
        player.wallet += parseInt(player.bet);
    } else {
        console.log('Round outcome: blackjack- player wins');
        player.wallet += 2.5 * parseInt(player.bet);
    }

    prepareNewRound(player, dealer);
}

function resolvePlayerBust() {
    console.log('Round outcome: bust- dealer wins');
    prepareNewRound(player, dealer);
}

function resolveRound() {
    if (dealer.handValue < 17) {
        deal(dealer);
        updateConsole();
        resolveRound();
    } else {
        if (dealer.handValue > 21) {
            console.log('Round outcome: dealer bust- player wins');
            player.wallet += 2 * parseInt(player.bet);
        } else {
            if (dealer.handValue > player.handValue) {
                console.log('Round outcome: dealer wins');
            } else if (dealer.handValue < player.handValue) {
                console.log('Round outcome: player wins');
                player.wallet += 2 * parseInt(player.bet);
            } else {
                console.log('Round outcome: draw');
                player.wallet += parseInt(player.bet);
            }
        }

        prepareNewRound(player, dealer);
    }
}

function prepareNewRound(player, dealer) {
    if (player.wallet > 0) {
        player.hand = [];
        dealer.hand = [];
        currentCard = -1;
        toggleBetFormVisibility();
        console.log('------------------');
        console.log('Wallet: ' + player.wallet);
    } else {
        console.log('Out of money, game over');
    }
}
