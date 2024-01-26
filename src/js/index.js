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
let player = { hands: [{ cardObjects: [], cards: [], handValue: 0, doubled: false }], currentHandIndex: 0, wallet: 900, bet: 100, insured: false };
let dealer = { cardObjects: [], cards: [], handValue: 0 };

// Round phases
function playFirstHand() {
    shuffle(deck);
    deal(player.hands[0]);
    deal(dealer);
    deal(player.hands[0]);
    deal(dealer);
    updateConsole();

    if (player.hands[0].handValue === 21) {
        if (dealer.cardObjects[1].value === 11 && player.wallet >= 0.5 * player.bet) {
            toggleEvenMoneyButtons();
        } else {
            resolveBlackjack();
        }
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

    if (player.hands[player.currentHandIndex].handValue === 21) {
        determineIfAllHandsPlayed();
    } else {
        showButtons();
    }
}

function resolveDealerHand() {
    if (dealer.handValue < 17) {
        deal(dealer);
        updateConsole();
        resolveDealerHand();
    } else {
        resolveBets();
    }
}

function resolveBlackjack() {
    if (dealer.handValue === 21) {
        console.log('Blackjack- draw');
        player.wallet += parseInt(player.bet);
    } else {
        console.log('Blackjack- player wins');

        if (player.bet % 2 === 1) {
            player.wallet += 2.5 * player.bet - 0.5;
        } else {
            player.wallet += 2.5 * parseInt(player.bet);
        }
    }

    prepareNewRound(player, dealer);
}

function resolveBets() {
    for (let i = 0; i < player.hands.length; i++) {
        if (player.hands[i].handValue > 21) {
            console.log('Hand ' + (i + 1) + ': bust- dealer wins');
        } else {
            if (dealer.handValue > 21) {
                console.log('Hand ' + (i + 1) + ': dealer bust- player wins');
                if (player.hands[i].doubled) {
                    player.wallet += 4 * parseInt(player.bet);
                } else {
                    player.wallet += 2 * parseInt(player.bet);
                }
            } else if (dealer.handValue === 21 && dealer.cardObjects.length === 2) {
                console.log('Hand ' + (i + 1) + ': dealer blackjack- dealer wins');
            } else {
                if (dealer.handValue > player.hands[i].handValue) {
                    console.log('Hand ' + (i + 1) + ': dealer wins');
                } else if (dealer.handValue < player.hands[i].handValue) {
                    console.log('Hand ' + (i + 1) + ': player wins');
                    if (player.hands[i].doubled) {
                        player.wallet += 4 * parseInt(player.bet);
                    } else {
                        player.wallet += 2 * parseInt(player.bet);
                    }
                } else {
                    console.log('Hand ' + (i + 1) + ': draw');
                    if (player.hands[i].doubled) {
                        player.wallet += 2 * parseInt(player.bet);
                    } else {
                        player.wallet += parseInt(player.bet);
                    }
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
        dealer.cardObjects = [];
        currentCard = -1;
        toggleBettingScreen();

        if (player.bet > player.wallet) {
            player.bet = player.wallet;
            document.querySelector('.bet').textContent = '$' + player.bet;
        }

        player.wallet -= player.bet;
        colourBetAdjustmentButtons();
        console.log('------------------');
        console.log('Wallet: ' + player.wallet);
        document.querySelector('.wallet').textContent = '$' + player.wallet;
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
    document.querySelector('.deckCounter').textContent = 51 - currentCard;
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
    console.log("Dealer's cards: " + dealer.cards);
    console.log("Dealer's score: " + dealer.handValue);
}

// Event listeners
document.querySelector('.subtract1Button').addEventListener('click', handleSubtract1Click);
document.querySelector('.add1Button').addEventListener('click', handleAdd1Click);
document.querySelector('.subtract10Button').addEventListener('click', handleSubtract10Click);
document.querySelector('.add10Button').addEventListener('click', handleAdd10Click);
document.querySelector('.subtract100Button').addEventListener('click', handleSubtract100Click);
document.querySelector('.add100Button').addEventListener('click', handleAdd100Click);
document.querySelector('.dealButton').addEventListener('click', handleDealClick);
document.querySelector('.acceptEvenMoneyButton').addEventListener('click', handleAcceptEvenMoneyClick);
document.querySelector('.rejectEvenMoneyButton').addEventListener('click', handleRejectEvenMoneyClick);
document.querySelector('.insuranceButton').addEventListener('click', handleInsuranceClick);
document.querySelector('.hitButton').addEventListener('click', handleHitClick);
document.querySelector('.standButton').addEventListener('click', handleStandClick);
document.querySelector('.splitButton').addEventListener('click', handleSplitClick);
document.querySelector('.doubleDownButton').addEventListener('click', handleDoubleDownClick);

// Event handlers
function handleSubtract1Click() {
    if (player.bet > 1) {
        adjustBet(-1);
    }
}

function handleAdd1Click() {
    if (player.bet < 500 && player.wallet > 0) {
        adjustBet(1);
    }
}

function handleSubtract10Click() {
    if (player.bet > 10) {
        adjustBet(-10);
    }
}

function handleAdd10Click() {
    if (player.bet < 491 && player.wallet > 9) {
        adjustBet(10);
    }
}

function handleSubtract100Click() {
    if (player.bet > 100) {
        adjustBet(-100);
    }
}

function handleAdd100Click() {
    if (player.bet < 401 && player.wallet > 99) {
        adjustBet(100);
    }
}

function adjustBet(adjustment) {
    player.bet += adjustment;
    player.wallet -= adjustment;
    document.querySelector('.bet').textContent = '$' + player.bet;
    document.querySelector('.wallet').textContent = '$' + player.wallet;
    colourBetAdjustmentButtons();
}

function handleDealClick() {
    toggleBettingScreen();
    playFirstHand();
}

function handleBet(bet, player) {
    player.bet = bet;
    player.wallet -= bet;
    console.log('Bet: ' + player.bet);
    document.querySelector('.bet').textContent = '$' + player.bet;
    console.log('Wallet: ' + player.wallet);
    document.querySelector('.wallet').textContent = '$' + player.wallet;
}

function handleHitClick() {
    hideSplitDoubleDownButtons();
    hideInsuranceButton();
    deal(player.hands[player.currentHandIndex]);
    updateConsole();

    if (player.hands[player.currentHandIndex].handValue >= 21) {
        hideHitStandButtons();
        determineIfAllHandsPlayed();
    }
}

function handleStandClick() {
    hideSplitDoubleDownButtons();
    hideHitStandButtons();
    hideInsuranceButton();
    determineIfAllHandsPlayed();
}

function handleSplitClick() {
    hideSplitDoubleDownButtons();
    hideHitStandButtons();
    hideInsuranceButton();
    handleBet(player.bet, player);
    splitHand(player);
    player.currentHandIndex--;
    playNextHand();
}

function splitHand(player) {
    const currentHand = player.hands[player.currentHandIndex];
    player.hands.push({ cardObjects: [currentHand.cardObjects.pop()], cards: [], handValue: 0 });
}

function handleDoubleDownClick() {
    hideSplitDoubleDownButtons();
    hideHitStandButtons();
    hideInsuranceButton();
    handleBet(player.bet, player);
    player.hands[player.currentHandIndex].doubled = true;
    deal(player.hands[player.currentHandIndex]);
    updateConsole();
    determineIfAllHandsPlayed();
}

function handleInsuranceClick() {
    hideInsuranceButton();
    handleSideBet(0.5 * player.bet, player);
    player.insured = true;

    if (dealer.handValue === 21) {
        hideHitStandButtons();
        hideSplitDoubleDownButtons();
        player.wallet += 1.5 * parseInt(player.bet);
        console.log('Insurance bet won');
        resolveBets();
    } else {
        console.log('Insurance bet lost');
    }
}

function handleSideBet(bet, player) {
    player.wallet -= bet;
    console.log('Wallet: ' + player.wallet);
    document.querySelector('.wallet').textContent = '$' + player.wallet;
}

function handleAcceptEvenMoneyClick() {
    toggleEvenMoneyButtons();
    player.wallet += 2 * parseInt(player.bet);
    prepareNewRound(player, dealer);
}

function handleRejectEvenMoneyClick() {
    toggleEvenMoneyButtons();
    resolveBlackjack();
}

// HTML element appearance toggling
function toggleBettingScreen() {
    document.querySelector('.deckCounter').classList.toggle('hidden');
    document.querySelector('.dealButton').classList.toggle('hidden');
    document.querySelector('.cashOutButton').classList.toggle('hidden');
    document.querySelector('.betAdjustment').classList.toggle('hidden');
}

function showButtons() {
    document.querySelector('.hitButton').classList.remove('hidden');
    document.querySelector('.standButton').classList.remove('hidden');

    if (player.wallet >= player.bet) {
        const currentHand = player.hands[player.currentHandIndex];

        if (currentHand.cardObjects[0].value === currentHand.cardObjects[1].value) {
            document.querySelector('.splitButton').classList.remove('hidden');
        }

        if (currentHand.handValue > 8 && currentHand.handValue < 12) {
            document.querySelector('.doubleDownButton').classList.remove('hidden');
        }
    }

    if (!player.insured && dealer.cardObjects[1].value === 11 && player.wallet >= 0.5 * player.bet) {
        document.querySelector('.insuranceButton').classList.remove('hidden');
    }
}

function hideHitStandButtons() {
    document.querySelector('.hitButton').classList.add('hidden');
    document.querySelector('.standButton').classList.add('hidden');
}

function hideSplitDoubleDownButtons() {
    document.querySelector('.splitButton').classList.add('hidden');
    document.querySelector('.doubleDownButton').classList.add('hidden');
}

function hideInsuranceButton() {
    document.querySelector('.insuranceButton').classList.add('hidden');
}

function toggleEvenMoneyButtons() {
    document.querySelector('.acceptEvenMoneyButton').classList.toggle('hidden');
    document.querySelector('.rejectEvenMoneyButton').classList.toggle('hidden');
}

function colourBetAdjustmentButtons() {
    if (player.bet < 2) {
        makeButtonRed('.subtract1Button');
    } else {
        makeButtonWhite('.subtract1Button');
    }

    if (player.bet > 499 || player.wallet < 1) {
        makeButtonRed('.add1Button');
    } else {
        makeButtonWhite('.add1Button');
    }

    if (player.bet < 11) {
        makeButtonRed('.subtract10Button');
    } else {
        makeButtonWhite('.subtract10Button');
    }

    if (player.bet > 490 || player.wallet < 10) {
        makeButtonRed('.add10Button');
    } else {
        makeButtonWhite('.add10Button');
    }

    if (player.bet < 101) {
        makeButtonRed('.subtract100Button');
    } else {
        makeButtonWhite('.subtract100Button');
    }

    if (player.bet > 400 || player.wallet < 100) {
        makeButtonRed('.add100Button');
    } else {
        makeButtonWhite('.add100Button');
    }
}

function makeButtonRed(button) {
    document.querySelector(button).classList.remove('bg-slate-100');
    document.querySelector(button).classList.add('bg-red-600');
}

function makeButtonWhite(button) {
    document.querySelector(button).classList.remove('bg-red-600');
    document.querySelector(button).classList.add('bg-slate-100');
}
