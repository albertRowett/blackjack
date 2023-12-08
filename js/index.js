// Unshuffled deck
let deck = [
    { card: 'twoHearts', value: 2 },
    { card: 'threeHearts', value: 3 },
    { card: 'fourHearts', value: 4 },
    { card: 'fiveHearts', value: 5 },
    { card: 'sixHearts', value: 6 },
    { card: 'sevenHearts', value: 7 },
    { card: 'eightHearts', value: 8 },
    { card: 'nineHearts', value: 9 },
    { card: 'tenHearts', value: 10 },
    { card: 'jackHearts', value: 10 },
    { card: 'queenHearts', value: 10 },
    { card: 'kingHearts', value: 10 },
    { card: 'aceHearts', value: 11 },
    { card: 'twoDiamonds', value: 2 },
    { card: 'threeDiamonds', value: 3 },
    { card: 'fourDiamonds', value: 4 },
    { card: 'fiveDiamonds', value: 5 },
    { card: 'sixDiamonds', value: 6 },
    { card: 'sevenDiamonds', value: 7 },
    { card: 'eightDiamonds', value: 8 },
    { card: 'nineDiamonds', value: 9 },
    { card: 'tenDiamonds', value: 10 },
    { card: 'jackDiamonds', value: 10 },
    { card: 'queenDiamonds', value: 10 },
    { card: 'kingDiamonds', value: 10 },
    { card: 'aceDiamonds', value: 11 },
    { card: 'twoClubs', value: 2 },
    { card: 'threeClubs', value: 3 },
    { card: 'fourClubs', value: 4 },
    { card: 'fiveClubs', value: 5 },
    { card: 'sixClubs', value: 6 },
    { card: 'sevenClubs', value: 7 },
    { card: 'eightClubs', value: 8 },
    { card: 'nineClubs', value: 9 },
    { card: 'tenClubs', value: 10 },
    { card: 'jackClubs', value: 10 },
    { card: 'queenClubs', value: 10 },
    { card: 'kingClubs', value: 10 },
    { card: 'aceClubs', value: 11 },
    { card: 'twoSpades', value: 2 },
    { card: 'threeSpades', value: 3 },
    { card: 'fourSpades', value: 4 },
    { card: 'fiveSpades', value: 5 },
    { card: 'sixSpades', value: 6 },
    { card: 'sevenSpades', value: 7 },
    { card: 'eightSpades', value: 8 },
    { card: 'nineSpades', value: 9 },
    { card: 'tenSpades', value: 10 },
    { card: 'jackSpades', value: 10 },
    { card: 'queenSpades', value: 10 },
    { card: 'kingSpades', value: 10 },
    { card: 'aceSpades', value: 11 }
];

let currentCard = -1;

// Initial (empty) hands
let player = { hands: [{ cardObjects: [], cards: [], handValue: 0 }], currentHandIndex: 0, wallet: 1000, bet: 0 };
let dealer = { hands: [{ cardObjects: [], cards: [], handValue: 0 }], currentHandIndex: 0 };

// Round phases
function playFirstHand() {
    shuffle(deck);
    deal(player.hands[0]);
    deal(dealer.hands[0]);
    deal(player.hands[0]);
    deal(dealer.hands[0]);
    updateConsole();

    if (player.hands[0].handValue === 21) {
        resolveBlackjack();
    } else {
        showButtons();
    }
}

function determineIfAllHandsPlayed() {
    if (player.currentHandIndex + 1 < player.hands.length) {
        playNextHand();
    } else {
        resolveDealerHand();
    }
}

function playNextHand() {
    player.currentHandIndex++;
    deal(player.hands[player.currentHandIndex]);
    updateConsole();

    if (player.hands[player.currentHandIndex] === 21) {
        determineIfAllHandsPlayed();
    } else {
        showButtons();
    }
}

function resolveDealerHand() {
    if (dealer.hands[0].handValue < 17) {
        deal(dealer.hands[0]);
        updateConsole();
        resolveDealerHand();
    } else {
        resolveBets();
    }
}

function resolveBlackjack() {
    if (dealer.hands[0].handValue === 21) {
        console.log('Blackjack- draw');
        player.wallet += parseInt(player.bet);
    } else {
        console.log('Blackjack- player wins');
        player.wallet += 2.5 * parseInt(player.bet);
    }

    prepareNewRound(player, dealer);
}

function resolveBets() {
    for (let i = 0; i < player.hands.length; i++) {
        if (player.hands[i].handValue > 21) {
            console.log('Hand ' + (i + 1) + ': bust- dealer wins');
        } else {
            if (dealer.hands[0].handValue > 21) {
                console.log('Hand ' + (i + 1) + ': dealer bust- player wins');
                player.wallet += 2 * parseInt(player.bet);
            } else {
                if (dealer.hands[0].handValue > player.hands[i].handValue) {
                    console.log('Hand ' + (i + 1) + ': dealer wins');
                } else if (dealer.hands[0].handValue < player.hands[i].handValue) {
                    console.log('Hand ' + (i + 1) + ': player wins');
                    player.wallet += 2 * parseInt(player.bet);
                } else {
                    console.log('Hand ' + (i + 1) + ': draw');
                    player.wallet += parseInt(player.bet);
                }
            }
        }
    }

    prepareNewRound(player, dealer);
}

function prepareNewRound(player, dealer) {
    if (player.wallet > 0) {
        player.hands = [{ cardObjects: [], cards: [], handValue: 0 }];
        player.currentHandIndex = 0;
        dealer.hands = [{ cardObjects: [], cards: [], handValue: 0 }];
        currentCard = -1;
        toggleBetFormVisibility();
        console.log('------------------');
        console.log('Wallet: ' + player.wallet);
    } else {
        console.log('Out of money, game over');
    }
}

// Key game functions
function shuffle(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    return deck;
}

function deal(hand) {
    currentCard++;
    const dealtCard = deck[currentCard];
    hand.cardObjects.push(dealtCard);
    hand.cards = updateCards(hand.cardObjects);
    hand.handValue = updateHandValue(hand);
}

function updateCards(cardObjects) {
    const cards = cardObjects.map((cardObject) => {
        return cardObject.card;
    });
    return cards;
}

function updateHandValue(hand) {
    const cardValues = hand.cardObjects.map((cardObject) => {
        return cardObject.value;
    });
    const handValue = cardValues.reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
    }, 0);

    return resolveAces(handValue, hand.cards);
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
    console.log("Player's cards (hand " + (player.currentHandIndex + 1) + '): ' + player.hands[player.currentHandIndex].cards);
    console.log("Player's score (hand " + (player.currentHandIndex + 1) + '): ' + player.hands[player.currentHandIndex].handValue);
    console.log("Dealer's cards: " + dealer.hands[0].cards);
    console.log("Dealer's score: " + dealer.hands[0].handValue);
}

// Event listeners
document.querySelector('.betForm').addEventListener('submit', handleBetSubmit);
document.querySelector('.hitButton').addEventListener('click', handleHitClick);
document.querySelector('.standButton').addEventListener('click', handleStandClick);
document.querySelector('.splitButton').addEventListener('click', handleSplitClick);

// Event handlers
function handleBetSubmit(e) {
    e.preventDefault();
    const bet = document.querySelector('#bet').value;

    if (bet) {
        if (bet <= player.wallet) {
            handleBet(bet, player);
            toggleBetFormVisibility();
            playFirstHand();
        } else {
            console.log('Bet must not be greater than wallet amount');
        }
    } else {
        console.log('Bet must be between 2 and 500');
    }
}

function handleBet(bet, player) {
    player.bet = bet;
    player.wallet -= bet;
    console.log('Bet: ' + player.bet);
    console.log('Wallet: ' + player.wallet);
}

function handleHitClick() {
    hideSplitButton();
    deal(player.hands[player.currentHandIndex]);
    updateConsole();

    if (player.hands[player.currentHandIndex].handValue >= 21) {
        hideHitStandButtons();
        determineIfAllHandsPlayed();
    }
}

function handleStandClick() {
    hideSplitButton();
    hideHitStandButtons();
    determineIfAllHandsPlayed();
}

function handleSplitClick() {
    hideSplitButton();
    hideHitStandButtons();
    handleBet(player.bet, player);
    splitHand(player);
    player.currentHandIndex--;
    playNextHand();
}

function splitHand(player) {
    const currentHand = player.hands[player.currentHandIndex];
    player.hands.push({ cardObjects: [currentHand.cardObjects.pop()], cards: [], handValue: 0 });
}

// HTML element visibility toggling
function toggleBetFormVisibility() {
    document.querySelector('.betForm').classList.toggle('hidden');
}

function showButtons() {
    document.querySelector('.hitButton').classList.remove('hidden');
    document.querySelector('.standButton').classList.remove('hidden');

    if (player.hands[player.currentHandIndex].cardObjects[0].value === player.hands[player.currentHandIndex].cardObjects[1].value && player.wallet >= player.bet) {
        document.querySelector('.splitButton').classList.remove('hidden');
    }
}

function hideHitStandButtons() {
    document.querySelector('.hitButton').classList.add('hidden');
    document.querySelector('.standButton').classList.add('hidden');
}

function hideSplitButton() {
    document.querySelector('.splitButton').classList.add('hidden');
}
