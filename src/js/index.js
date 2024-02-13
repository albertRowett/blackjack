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
    updateDisplay('player', player.hands[0], false);
    setTimeout(() => {
        deal(dealer);
        updateDisplay('dealer', dealer, true);
    }, 500);
    setTimeout(() => {
        deal(player.hands[0]);
        updateDisplay('player', player.hands[0], false);
    }, 1000);
    setTimeout(() => {
        deal(dealer);
        updateDisplay('dealer', dealer, true);

        if (player.hands[0].handValue === 21) {
            announce('.playerBlackjack');

            if (dealer.cardObjects[1].value === 11 && player.wallet >= 0.5 * player.bet) {
                setTimeout(toggleEvenMoneyButtons, 2750);
            } else {
                setTimeout(resolveBlackjack, 3000);
            }
        } else {
            setTimeout(showButtons, 250);
        }
    }, 1500);
}

function determineIfAllHandsPlayed() {
    if (player.currentHandIndex + 1 < player.hands.length) {
        playNextHand();
    } else {
        updateDisplay('dealer', dealer, false);

        if (dealer.handValue === 21) {
            announce('.dealerBlackjack');
            setTimeout(resolveHand, 1500);
        } else {
            resolveHand();
        }
    }
}

function playNextHand() {
    player.currentHandIndex++;
    updateDisplay('player', player.hands[player.currentHandIndex], false);
    updateSplitHandsArea();
    setTimeout(() => {
        deal(player.hands[player.currentHandIndex]);
        updateDisplay('player', player.hands[player.currentHandIndex], false);

        if (player.hands[player.currentHandIndex].handValue === 21) {
            setTimeout(determineIfAllHandsPlayed, 1000);
        } else {
            setTimeout(showButtons, 250);
        }
    }, 500);
}

function resolveBlackjack() {
    updateDisplay('dealer', dealer, false);

    if (dealer.handValue === 21) {
        announce('.dealerBlackjack');
        console.log('Blackjack- draw');
        setTimeout(() => {
            announceResult('Push');
        }, 1500);
        player.wallet += parseInt(player.bet);
        setTimeout(prepareNewRound, 4500);
    } else {
        console.log('Blackjack- player wins');
        announceResult('You win');

        if (player.bet % 2 === 1) {
            player.wallet += 2.5 * player.bet - 0.5;
        } else {
            player.wallet += 2.5 * parseInt(player.bet);
        }

        setTimeout(prepareNewRound, 3000);
    }
}

function resolveHand() {
    let playerHand = player.hands[player.currentHandIndex];
    updateDisplay('player', playerHand, false);
    updateSplitHandsArea();

    if (playerHand.handValue > 21) {
        announceResult('Dealer wins');
        setTimeout(determineIfAllHandsResolved, 3000);
    } else {
        resolveDealerHand(playerHand);
    }
}

function determineIfAllHandsResolved() {
    if (player.currentHandIndex === 0) {
        prepareNewRound();
    } else {
        player.currentHandIndex--;
        resolveHand();
    }
}

function resolveDealerHand(playerHand) {
    if (dealer.handValue < 17) {
        setTimeout(() => {
            deal(dealer);
            updateDisplay('dealer', dealer, false);

            if (dealer.handValue > 21) {
                announce('.dealerBust');
                setTimeout(() => {
                    finishResolvingHand(playerHand);
                }, 1500);
            } else {
                resolveDealerHand(playerHand);
            }
        }, 1000);
    } else {
        finishResolvingHand(playerHand);
    }
}

function finishResolvingHand(playerHand) {
    if (dealer.handValue > 21) {
        announceResult('You win');
        if (playerHand.doubled) {
            player.wallet += 4 * player.bet;
        } else {
            player.wallet += 2 * player.bet;
        }
    } else if (dealer.handValue === 21 && dealer.cards.length === 2) {
        announceResult('Dealer wins');
    } else {
        if (dealer.handValue > playerHand.handValue) {
            announceResult('Dealer wins');
        } else if (dealer.handValue < playerHand.handValue) {
            announceResult('You win');
            if (playerHand.doubled) {
                player.wallet += 4 * player.bet;
            } else {
                player.wallet += 2 * player.bet;
            }
        } else {
            announceResult('Push');
            if (playerHand.doubled) {
                player.wallet += 2 * player.bet;
            } else {
                player.wallet += player.bet;
            }
        }
    }

    setTimeout(determineIfAllHandsResolved, 3000);
}

function prepareNewRound() {
    if (player.wallet > 0) {
        player.hands = [{ cardObjects: [], cards: [], handValue: 0 }];
        player.currentHandIndex = 0;
        player.insured = false;
        dealer.cardObjects = [];
        updateDisplay('dealer', dealer, true);
        currentCard = -1;
        toggleBetVsPlayScreens();

        if (player.bet > player.wallet) {
            player.bet = player.wallet;
            document.querySelector('.bet').textContent = '$' + player.bet;
        }

        player.wallet -= player.bet;
        colourBetAdjustmentButtons();
        console.log('------------------');
        console.log('Wallet: ' + player.wallet);
        document.querySelector('.wallet').textContent = '$' + player.wallet;
        document.querySelector('.bet').textContent = '$' + player.bet;
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

function updateDisplay(person, hand, firstCardHidden) {
    let cardsHTML = '';

    hand.cardObjects.forEach((cardObject, index) => {
        if (firstCardHidden) {
            if (index === 0) {
                cardsHTML += '<img src="images/cards/backRed.svg" class="absolute h-28" />';
            } else {
                cardsHTML += '<img src="images/cards/' + cardObject.card + '.svg" class="absolute h-28 offset-1" />';
            }
        } else {
            cardsHTML += '<img src="images/cards/' + cardObject.card + '.svg" class="absolute h-28 offset-' + index + '" />';
        }

        if (index === 0) {
            cardsHTML += '<div class="w-[6.5208rem] h-28"></div>';
        } else if (index > 1) {
            cardsHTML += '<div class="w-[1.375rem]"></div>';
        }
    });

    document.querySelector('.' + person + 'Cards').innerHTML = cardsHTML;

    if (firstCardHidden) {
        if (dealer.cardObjects[1]) {
            document.querySelector('.dealerScore').textContent = dealer.cardObjects[1].value;
        } else {
            document.querySelector('.dealerScore').textContent = 0;
        }
    } else {
        document.querySelector('.' + person + 'Score').textContent = hand.handValue;
    }

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
    toggleBetVsPlayScreens();
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
    updateDisplay('player', player.hands[player.currentHandIndex], false);

    if (player.hands[player.currentHandIndex].handValue >= 21) {
        hideHitStandButtons();

        if (player.hands[player.currentHandIndex].handValue > 21) {
            announce('.playerBust');
            setTimeout(determineIfAllHandsPlayed, 3000);
        } else {
            setTimeout(determineIfAllHandsPlayed, 1000);
        }
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
    currentHand.cards = updateCards(currentHand.cardObjects);
    currentHand.handValue = updateHandValue(currentHand);
    const newHand = player.hands[player.currentHandIndex + 1];
    newHand.cards = updateCards(newHand.cardObjects);
    newHand.handValue = updateHandValue(newHand);
}

function handleDoubleDownClick() {
    hideSplitDoubleDownButtons();
    hideHitStandButtons();
    hideInsuranceButton();
    handleBet(player.bet, player);
    player.hands[player.currentHandIndex].doubled = true;
    deal(player.hands[player.currentHandIndex]);
    updateDisplay('player', player.hands[player.currentHandIndex], false);
    setTimeout(determineIfAllHandsPlayed, 1000);
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
        updateDisplay('dealer', dealer, false);
        announce('.dealerBlackjack');
        setTimeout(resolveHand, 1500);
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
    player.wallet += 2 * player.bet;
    document.querySelector('.bet').textContent = '';
    document.querySelector('.wallet').textContent = '$' + player.wallet;

    setTimeout(() => {
        updateDisplay('dealer', dealer, false);

        if (dealer.handValue === 21) {
            announce('.dealerBlackjack');
            setTimeout(prepareNewRound, 2750);
        } else {
            setTimeout(prepareNewRound, 1500);
        }
    }, 1000);
}

function handleRejectEvenMoneyClick() {
    toggleEvenMoneyButtons();
    resolveBlackjack();
}

// HTML element appearance toggling
function toggleBetVsPlayScreens() {
    document.querySelector('.deckCounter').classList.toggle('hidden');
    document.querySelector('.dealButton').classList.toggle('hidden');
    document.querySelector('.dealerCards').classList.toggle('hidden');
    document.querySelector('.dealerCards').classList.toggle('flex');
    document.querySelector('.dealerScore').classList.toggle('hidden');
    document.querySelector('.dealerScore').classList.toggle('flex');
    document.querySelector('.playerCards').classList.toggle('hidden');
    document.querySelector('.playerCards').classList.toggle('flex');
    document.querySelector('.playerScore').classList.toggle('hidden');
    document.querySelector('.playerScore').classList.toggle('flex');
    document.querySelector('.cashOutButton').classList.toggle('hidden');
    document.querySelector('.betAdjustment').classList.toggle('hidden');
    document.querySelector('.splitHandsArea').classList.add('hidden');
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

function announce(targetElement) {
    setTimeout(() => {
        document.querySelector(targetElement).classList.remove('hidden');
        document.querySelector(targetElement).classList.add('animate-popUpOut');
    }, 500);
    setTimeout(() => {
        document.querySelector(targetElement).classList.add('hidden');
        document.querySelector(targetElement).classList.remove('animate-popUpOut');
    }, 2500);
}

function announceResult(messageText) {
    document.querySelector('.resultMessage').textContent = messageText;
    setTimeout(() => {
        document.querySelector('.handResult').classList.remove('hidden');
        document.querySelector('.handResult').classList.add('animate-popUp');
    }, 1000);
    setTimeout(() => {
        document.querySelector('.handResult').classList.add('hidden');
        document.querySelector('.handResult').classList.remove('animate-popUp');
    }, 3000);
}

function updateSplitHandsArea() {
    let splitHandsHTML = '<div class="flex flex-wrap gap-x-2 gap-y-1 h-[7.25rem] mx-4 mt-3 mb-2">';

    player.hands.forEach ((hand, index) => {
        if (index !== player.currentHandIndex) {
            splitHandsHTML += '<div class="relative flex">'

            hand.cardObjects.forEach((cardObject, index) => {
                if (index % 2 === 0) {
                    splitHandsHTML += '<img src="images/cards/' + cardObject.card + '.svg" class="absolute h-14 offset-' + (index / 2) + '" />';
                } else {
                    splitHandsHTML += '<img src="images/cards/' + cardObject.card + '.svg" class="absolute h-14 offset-half-' + index + '" />';
                }
            
                if (index === 0) {
                    splitHandsHTML += '<div class="w-[2.5729rem] h-14"></div>';
                } else {
                    splitHandsHTML += '<div class="w-[0.6875rem] h-14"></div>';
                }
            });

            splitHandsHTML += '</div>';
        }
    });

    splitHandsHTML += '</div>';

    const splitHandsArea = document.querySelector('.splitHandsArea');
    splitHandsArea.innerHTML = splitHandsHTML;
    splitHandsArea.classList.remove('hidden');
}
