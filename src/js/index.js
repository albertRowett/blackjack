// Unshuffled deck
let deck = [];
const suits = ['clubs', 'diamonds', 'hearts', 'spades'];
suits.forEach((suit) => {
    deck.push({ suit: suit, rank: 'two', value: 2 });
    deck.push({ suit: suit, rank: 'three', value: 3 });
    deck.push({ suit: suit, rank: 'four', value: 4 });
    deck.push({ suit: suit, rank: 'five', value: 5 });
    deck.push({ suit: suit, rank: 'six', value: 6 });
    deck.push({ suit: suit, rank: 'seven', value: 7 });
    deck.push({ suit: suit, rank: 'eight', value: 8 });
    deck.push({ suit: suit, rank: 'nine', value: 9 });
    deck.push({ suit: suit, rank: 'ten', value: 10 });
    deck.push({ suit: suit, rank: 'jack', value: 10 });
    deck.push({ suit: suit, rank: 'queen', value: 10 });
    deck.push({ suit: suit, rank: 'king', value: 10 });
    deck.push({ suit: suit, rank: 'ace', value: 11 });
});

let currentCard = 0;

// Initial (empty) hands
let player = {
    hands: [{ cards: [], handValue: 0, doubled: false }],
    currentHandIndex: 0,
    wallet: 900,
    bet: 100,
    insured: false
};
let dealer = { cards: [], handValue: 0 };

// Round phases and associated logic functions
function playFirstHand() {
    updateDeckCounterVisual();
    shuffle(deck);
    setTimeout(() => {
        deal(player.hands[0]);
        updateCardsAndScoreVisuals('player', player.hands[0], false);
    }, 500);
    setTimeout(() => {
        deal(dealer);
        updateCardsAndScoreVisuals('dealer', dealer, true);
    }, 1000);
    setTimeout(() => {
        deal(player.hands[0]);
        updateCardsAndScoreVisuals('player', player.hands[0], false);
    }, 1500);
    setTimeout(() => {
        deal(dealer);
        updateCardsAndScoreVisuals('dealer', dealer, true);

        if (player.hands[0].handValue === 21) {
            playAnimation('.playerBlackjackPopUp');

            // Timers account for blackjack pop-up animation length (2500 ms)
            if (dealer.cards[1].value === 11) {
                setTimeout(toggleEvenMoneyButtons, 2750);
            } else {
                setTimeout(resolveBlackjack, 3000);
            }
        } else {
            setTimeout(showButtons, 250);
        }
    }, 2000);
}

function shuffle(deck) {
    // Fisher-Yates shuffle algorithm
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    return deck;
}

function deal(hand) {
    const dealtCard = deck[currentCard];
    hand.cards.push(dealtCard);
    hand.handValue = updateHandValue(hand);
    currentCard++;
    updateDeckCounterVisual();
}

function updateHandValue(hand) {
    let handValue = 0;
    hand.cards.forEach((card) => {
        handValue += card.value;
    });

    return resolveAces(hand, handValue);
}

function resolveAces(hand, handValue) {
    if (handValue > 21) {
        for (let i = 0; i < hand.cards.length; i++) {
            if (hand.cards[i].rank === 'ace') {
                // Count ace as 1 instead of 11
                handValue -= 10;
            }

            if (handValue < 22) {
                break;
            }
        }
    }

    return handValue;
}

function determineIfAllHandsPlayed() {
    if (player.currentHandIndex + 1 < player.hands.length) {
        playNextHand();
    } else {
        updateCardsAndScoreVisuals('dealer', dealer, false);

        if (dealer.handValue === 21) {
            playAnimation('.dealerBlackjackPopUp');
            setTimeout(resolveHand, 2500);
        } else {
            setTimeout(resolveHand, 1000);
        }
    }
}

function playNextHand() {
    player.currentHandIndex++;
    const currentHand = player.hands[player.currentHandIndex];
    updateCardsAndScoreVisuals('player', currentHand, false);
    updateBetVisual('$' + player.bet);
    updateSplitHandsVisual();
    setTimeout(() => {
        deal(currentHand);
        updateCardsAndScoreVisuals('player', currentHand, false);

        // Hitting/resplitting split aces not permitted
        if (currentHand.cards[0].value === 11 || currentHand.handValue === 21) {
            setTimeout(determineIfAllHandsPlayed, 1000);
        } else {
            setTimeout(showButtons, 250);
        }
    }, 500);
}

function resolveBlackjack() {
    updateCardsAndScoreVisuals('dealer', dealer, false);

    if (dealer.handValue === 21) {
        playAnimation('.dealerBlackjackPopUp');
        // Wait for blackjack pop-up animation to complete
        setTimeout(() => {
            playResultAnimation('Push');
            player.wallet += player.bet;
            setTimeout(updateWalletVisual, 500);
            // Wait for result animation to complete
            setTimeout(prepareNewRound, 2000);
        }, 2500);
    } else {
        setTimeout(() => {
            playResultAnimation('You win');

            if (player.bet % 2 === 1) {
                player.wallet += 2.5 * player.bet - 0.5;
            } else {
                player.wallet += 2.5 * player.bet;
            }

            setTimeout(updateWalletVisual, 500);
            // Wait for result animation to complete
            setTimeout(prepareNewRound, 2000);
        }, 1000);
    }
}

function resolveHand() {
    const playerHand = player.hands[player.currentHandIndex];

    if (playerHand.handValue > 21) {
        playResultAnimation('Dealer wins');
        // Wait for result animation to complete
        setTimeout(determineIfAllHandsResolved, 2000);
    } else {
        resolveDealerHand(playerHand);
    }
}

function determineIfAllHandsResolved() {
    if (player.currentHandIndex === 0) {
        prepareNewRound();
    } else {
        resolveNextHand();
    }
}

function resolveNextHand() {
    player.currentHandIndex--;
    const playerHand = player.hands[player.currentHandIndex];
    updateCardsAndScoreVisuals('player', playerHand, false);

    if (playerHand.doubled) {
        updateBetVisual('$' + 2 * player.bet);
    } else {
        updateBetVisual('$' + player.bet);
    }

    updateSplitHandsVisual();
    setTimeout(resolveHand, 1000);
}

function resolveDealerHand(playerHand) {
    if (dealer.handValue < 17) {
        deal(dealer);
        updateCardsAndScoreVisuals('dealer', dealer, false);

        if (dealer.handValue > 21) {
            playAnimation('.dealerBustPopUp');
            // Wait for bust pop-up animation to complete
            setTimeout(() => {
                finishResolvingHand(playerHand);
            }, 2500);
        } else {
            setTimeout(() => {
                resolveDealerHand(playerHand);
            }, 1000);
        }
    } else {
        finishResolvingHand(playerHand);
    }
}

function finishResolvingHand(playerHand) {
    if (dealer.handValue > 21) {
        playResultAnimation('You win');

        if (playerHand.doubled) {
            player.wallet += 4 * player.bet;
        } else {
            player.wallet += 2 * player.bet;
        }
    } else if (dealer.handValue === 21 && dealer.cards.length === 2) {
        playResultAnimation('Dealer wins');
    } else {
        if (dealer.handValue > playerHand.handValue) {
            playResultAnimation('Dealer wins');
        } else if (dealer.handValue < playerHand.handValue) {
            playResultAnimation('You win');

            if (playerHand.doubled) {
                player.wallet += 4 * player.bet;
            } else {
                player.wallet += 2 * player.bet;
            }
        } else {
            playResultAnimation('Push');

            if (playerHand.doubled) {
                player.wallet += 2 * player.bet;
            } else {
                player.wallet += player.bet;
            }
        }
    }

    setTimeout(updateWalletVisual, 500);
    // Wait for result animation to complete
    setTimeout(determineIfAllHandsResolved, 2000);
}

function prepareNewRound() {
    if (player.wallet > 0) {
        currentCard = 0;
        player.hands = [{ cards: [], handValue: 0, doubled: false }];
        updateCardsAndScoreVisuals('player', player.hands[0], false);
        player.currentHandIndex = 0;
        player.insured = false;
        dealer.cards = [];
        updateCardsAndScoreVisuals('dealer', dealer, true);
        toggleBetVsPlayScreens();

        if (player.bet > player.wallet) {
            player.bet = player.wallet;
        }

        player.wallet -= player.bet;
        updateWalletVisual();
        updateBetVisual('$' + player.bet);
        colourBetAdjustmentButtons();
    } else {
        document.querySelector('.instructionsModal').close();
        showGameEndModal('outOfMoney');
    }
}

// Event listeners
document.querySelector('.playButton').addEventListener('click', handlePlayClick);
document.querySelector('.instructionsButton').addEventListener('click', handleInstructionsClick);
document.querySelector('.instructionsModalCloseButton').addEventListener('click', handleInstructionsModalCloseClick);
document.querySelector('.instructionsModal').addEventListener('click', handleOutsideInstructionsModalClick);
document.querySelector('.cashOutButton').addEventListener('click', handleCashOutClick);
document.querySelector('.cancelCashOutButton').addEventListener('click', handleCancelCashOutClick);
document
    .querySelector('.cashOutConfirmationModal')
    .addEventListener('click', handleOutsideCashOutConfirmationModalClick);
document.querySelector('.confirmCashOutButton').addEventListener('click', handleConfirmCashOutClick);
document.querySelector('.gameEndModal').addEventListener('keydown', handleGameEndEscPress);
document.querySelector('.playAgainButton').addEventListener('click', handlePlayAgainClick);
document.querySelector('.subtract1Button').addEventListener('click', handleSubtract1Click);
document.querySelector('.add1Button').addEventListener('click', handleAdd1Click);
document.querySelector('.subtract10Button').addEventListener('click', handleSubtract10Click);
document.querySelector('.add10Button').addEventListener('click', handleAdd10Click);
document.querySelector('.subtract100Button').addEventListener('click', handleSubtract100Click);
document.querySelector('.add100Button').addEventListener('click', handleAdd100Click);
document.querySelector('.dealButton').addEventListener('click', handleDealClick);
document.querySelector('.hitButton').addEventListener('click', handleHitClick);
document.querySelector('.standButton').addEventListener('click', handleStandClick);
document.querySelector('.splitButton').addEventListener('click', handleSplitClick);
document.querySelector('.doubleDownButton').addEventListener('click', handleDoubleDownClick);
document.querySelector('.insuranceButton').addEventListener('click', handleInsuranceClick);
document.querySelector('.acceptEvenMoneyButton').addEventListener('click', handleAcceptEvenMoneyClick);
document.querySelector('.rejectEvenMoneyButton').addEventListener('click', handleRejectEvenMoneyClick);

// Event handlers and associated logic functions
function handlePlayClick() {
    document.querySelector('.coverPage').classList.add('hidden');
}

function handleInstructionsClick() {
    document.querySelector('.instructionsModal').showModal();
}

function handleInstructionsModalCloseClick() {
    document.querySelector('.instructionsModal').close();
}

function handleOutsideInstructionsModalClick(event) {
    const instructionsModal = document.querySelector('.instructionsModal');
    if (event.target === instructionsModal) {
        instructionsModal.close();
    }
}

function handleCashOutClick() {
    document.querySelector('.cashOutConfirmationModal').showModal();
}

function handleCancelCashOutClick() {
    document.querySelector('.cashOutConfirmationModal').close();
}

function handleOutsideCashOutConfirmationModalClick(event) {
    const cashOutConfirmationModal = document.querySelector('.cashOutConfirmationModal');
    if (event.target === cashOutConfirmationModal) {
        cashOutConfirmationModal.close();
    }
}

function handleConfirmCashOutClick() {
    document.querySelector('.cashOutConfirmationModal').close();
    showGameEndModal('cashedOut');
}

function handleGameEndEscPress(event) {
    if (event.key === 'Escape') {
        event.preventDefault();
    }
}

function handlePlayAgainClick() {
    // If game ended by running out of money
    if (document.querySelector('.cashOutButton').classList.contains('hidden')) {
        player.wallet = 1000;
        player.bet = 100;
        prepareNewRound();
    } else {
        player.wallet = 900;
        player.bet = 100;
        updateWalletVisual();
        updateBetVisual('$' + player.bet);
        colourBetAdjustmentButtons();
    }

    document.querySelector('.gameEndModal').close();
}

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
    player.wallet -= adjustment;
    player.bet += adjustment;
    updateWalletVisual();
    updateBetVisual('$' + player.bet);
    colourBetAdjustmentButtons();
}

function handleDealClick() {
    toggleBetVsPlayScreens();
    playFirstHand();
}

function handleHitClick() {
    hideSplitAndDoubleDownButtons();
    hideInsuranceButton();
    const currentHand = player.hands[player.currentHandIndex];
    deal(currentHand);
    updateCardsAndScoreVisuals('player', currentHand, false);

    if (currentHand.handValue >= 21) {
        hideHitAndStandButtons();

        if (currentHand.handValue > 21) {
            playAnimation('.playerBustPopUp');
            // Timer accounts for bust pop-up animation length (2500 ms)
            setTimeout(determineIfAllHandsPlayed, 3000);
        } else {
            setTimeout(determineIfAllHandsPlayed, 1000);
        }
    }
}

function handleStandClick() {
    hideHitAndStandButtons();
    hideSplitAndDoubleDownButtons();
    hideInsuranceButton();
    determineIfAllHandsPlayed();
}

function handleSplitClick() {
    hideHitAndStandButtons();
    hideSplitAndDoubleDownButtons();
    hideInsuranceButton();
    handleSubsequentBet();
    splitHand(player);
    player.currentHandIndex--;
    playNextHand();
}

function handleSubsequentBet() {
    player.wallet -= player.bet;
    updateWalletVisual();
}

function splitHand(player) {
    const currentHand = player.hands[player.currentHandIndex];
    // Move second card in hand to new (second) hand
    player.hands.push({ cards: [currentHand.cards.pop()], handValue: 0, doubled: false });
    currentHand.handValue = updateHandValue(currentHand);
    const newHand = player.hands[player.currentHandIndex + 1];
    newHand.handValue = updateHandValue(newHand);
}

function handleDoubleDownClick() {
    hideHitAndStandButtons();
    hideSplitAndDoubleDownButtons();
    hideInsuranceButton();
    handleSubsequentBet();
    updateBetVisual('$' + 2 * player.bet);
    const currentHand = player.hands[player.currentHandIndex];
    currentHand.doubled = true;
    deal(currentHand);
    updateCardsAndScoreVisuals('player', currentHand, false);
    setTimeout(determineIfAllHandsPlayed, 1000);
}

function handleInsuranceClick() {
    hideHitAndStandButtons();
    hideSplitAndDoubleDownButtons();
    hideInsuranceButton();
    const sideBet = handleSideBet();
    player.insured = true;

    if (dealer.handValue === 21) {
        handleSuccessfulInsurance(sideBet);
    } else {
        handleUnsuccessfulInsurance();
    }
}

function handleSideBet() {
    const sideBet = calculateSideBet();
    player.wallet -= sideBet;
    updateWalletVisual();
    updateSideBetVisual('$' + sideBet);
    return sideBet;
}

function calculateSideBet() {
    let sideBet = 0.5 * player.bet;

    if (player.bet % 2 === 1) {
        sideBet += 0.5;
    }

    return sideBet;
}

function handleSuccessfulInsurance(sideBet) {
    setTimeout(() => {
        updateCardsAndScoreVisuals('dealer', dealer, false);
        playAnimation('.dealerBlackjackPopUp');
        // Timer accounts for blackjack pop-up animation length (2500 ms)
        setTimeout(() => {
            player.wallet += player.bet + sideBet;
            updateWalletVisual();
            updateSideBetVisual('');
            setTimeout(resolveHand, 500);
        }, 2750);
    }, 500);
}

function handleUnsuccessfulInsurance() {
    playAnimation('.dealerNoBlackjackPopUp');
    // Timer accounts for noBlackjack pop-up animation length (2500 ms)
    setTimeout(() => {
        updateSideBetVisual('');
        showButtons();
    }, 2750);
}

function handleAcceptEvenMoneyClick() {
    toggleEvenMoneyButtons();
    player.wallet += 2 * player.bet;
    updateBetVisual('');
    updateWalletVisual();

    setTimeout(() => {
        updateCardsAndScoreVisuals('dealer', dealer, false);

        if (dealer.handValue === 21) {
            playAnimation('.dealerBlackjackPopUp');
            // Timer accounts for blackjack pop-up animation length (2500 ms)
            setTimeout(prepareNewRound, 2750);
        } else {
            playAnimation('.dealerNoBlackjackPopUp');
            // Timer accounts for noBlackjack pop-up animation length (2500 ms)
            setTimeout(prepareNewRound, 2750);
        }
    }, 1000);
}

function handleRejectEvenMoneyClick() {
    toggleEvenMoneyButtons();
    resolveBlackjack();
}

// Visual functions
function toggleBetVsPlayScreens() {
    document.querySelector('.deckCounter').classList.toggle('hidden');
    document.querySelector('.dealButton').classList.toggle('hidden');
    document.querySelector('.dealerCards').classList.toggle('hidden');
    document.querySelector('.dealerScore').classList.toggle('hidden');
    document.querySelector('.playerCards').classList.toggle('hidden');
    document.querySelector('.playerScore').classList.toggle('hidden');
    document.querySelector('.cashOutButton').classList.toggle('hidden');
    document.querySelector('.betAdjustmentSection').classList.toggle('hidden');
    document.querySelector('.splitHandsSection').classList.add('hidden');
}

function colourBetAdjustmentButtons() {
    if (player.bet < 2) {
        colourButtonRed('.subtract1Button');
    } else {
        colourButtonWhite('.subtract1Button');
    }

    if (player.bet > 499 || player.wallet < 1) {
        colourButtonRed('.add1Button');
    } else {
        colourButtonWhite('.add1Button');
    }

    if (player.bet < 11) {
        colourButtonRed('.subtract10Button');
    } else {
        colourButtonWhite('.subtract10Button');
    }

    if (player.bet > 490 || player.wallet < 10) {
        colourButtonRed('.add10Button');
    } else {
        colourButtonWhite('.add10Button');
    }

    if (player.bet < 101) {
        colourButtonRed('.subtract100Button');
    } else {
        colourButtonWhite('.subtract100Button');
    }

    if (player.bet > 400 || player.wallet < 100) {
        colourButtonRed('.add100Button');
    } else {
        colourButtonWhite('.add100Button');
    }
}

function colourButtonRed(button) {
    document.querySelector(button).classList.remove('bg-slate-100', 'hover:bg-white');
    document.querySelector(button).classList.add('bg-red-500');
}

function colourButtonWhite(button) {
    document.querySelector(button).classList.remove('bg-red-500');
    document.querySelector(button).classList.add('bg-slate-100', 'hover:bg-white');
}

function updateDeckCounterVisual() {
    document.querySelector('.deckCounter').textContent = 52 - currentCard;
}

function updateCardsAndScoreVisuals(person, hand, firstCardHidden) {
    let cardsHTML = '';

    hand.cards.forEach((card, index) => {
        if (firstCardHidden && index === 0) {
            cardsHTML += '<img src="images/cards/backRed.svg" alt="Back of card" class="absolute h-28" />';
        } else {
            cardsHTML +=
                '<img src="images/cards/' +
                card.rank +
                card.suit.charAt(0).toUpperCase() +
                card.suit.slice(1) +
                '.svg" alt="' +
                card.rank.charAt(0).toUpperCase() +
                card.rank.slice(1) +
                ' of ' +
                card.suit +
                ' card" class="absolute h-28 offset-' +
                index +
                '" />';
        }

        if (index === 0) {
            // 6.5208rem is the width of the first two cards
            cardsHTML += '<div class="w-[6.5208rem] h-28"></div>';
        } else if (index > 1) {
            // 1.375rem is the offset for subsequent cards
            cardsHTML += '<div class="w-[1.375rem]"></div>';
        }
    });

    document.querySelector('.' + person + 'Cards').innerHTML = cardsHTML;

    let scoreToShow = hand.handValue;

    if (firstCardHidden) {
        // If dealer's second card has been dealt
        if (dealer.cards[1]) {
            scoreToShow = dealer.cards[1].value;
        } else {
            scoreToShow = 0;
        }
    }

    document.querySelector('.' + person + 'Score').textContent = scoreToShow;
}

function updateSplitHandsVisual() {
    let splitHandsHTML = '';

    player.hands.forEach((hand, index) => {
        if (index !== player.currentHandIndex) {
            splitHandsHTML += '<div class="relative flex">';

            hand.cards.forEach((card, index) => {
                if (index % 2 === 0) {
                    splitHandsHTML +=
                        '<img src="images/cards/' +
                        card.rank +
                        card.suit.charAt(0).toUpperCase() +
                        card.suit.slice(1) +
                        '.svg" alt="' +
                        card.rank.charAt(0).toUpperCase() +
                        card.rank.slice(1) +
                        ' of ' +
                        card.suit +
                        ' card" class="absolute h-14 offset-' +
                        index / 2 +
                        '" />';
                } else {
                    splitHandsHTML +=
                        '<img src="images/cards/' +
                        card.rank +
                        card.suit.charAt(0).toUpperCase() +
                        card.suit.slice(1) +
                        '.svg" alt="' +
                        card.rank.charAt(0).toUpperCase() +
                        card.rank.slice(1) +
                        ' of ' +
                        card.suit +
                        ' card" class="absolute h-14 offset-half-' +
                        index +
                        '" />';
                }

                if (index === 0) {
                    // 2.5729rem is the width of the first card
                    splitHandsHTML += '<div class="w-[2.5729rem] h-14"></div>';
                } else {
                    // 0.6875rem is the offset for subsequent cards
                    splitHandsHTML += '<div class="w-[0.6875rem] h-14"></div>';
                }
            });

            splitHandsHTML += '</div>';
        }
    });

    const splitHandsSection = document.querySelector('.splitHandsSection');
    splitHandsSection.innerHTML = splitHandsHTML;
    splitHandsSection.classList.remove('hidden');
}

function updateWalletVisual() {
    document.querySelector('.wallet').textContent = '$' + player.wallet;
}

function updateBetVisual(betText) {
    document.querySelector('.bet').textContent = betText;
}

function updateSideBetVisual(sideBetText) {
    document.querySelector('.sideBet').textContent = sideBetText;
}

function showButtons() {
    document.querySelector('.hitButton').classList.remove('hidden');
    document.querySelector('.standButton').classList.remove('hidden');

    if (player.wallet >= player.bet) {
        const currentHand = player.hands[player.currentHandIndex];

        if (currentHand.cards[0].value === currentHand.cards[1].value && player.hands.length < 4) {
            document.querySelector('.splitButton').classList.remove('hidden');
        }

        if (currentHand.handValue > 8 && currentHand.handValue < 12) {
            document.querySelector('.doubleDownButton').classList.remove('hidden');
        }
    }

    if (
        dealer.cards[1].value === 11 &&
        !player.insured &&
        player.hands.length === 1 &&
        player.wallet >= 0.5 * player.bet &&
        player.bet > 1
    ) {
        document.querySelector('.insuranceButton').classList.remove('hidden');
    }
}

function hideHitAndStandButtons() {
    document.querySelector('.hitButton').classList.add('hidden');
    document.querySelector('.standButton').classList.add('hidden');
}

function hideSplitAndDoubleDownButtons() {
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

function playAnimation(targetElement) {
    setTimeout(() => {
        document.querySelector(targetElement).classList.remove('hidden');
        document.querySelector(targetElement).classList.add('animate-popUpOut');
    }, 500);
    setTimeout(() => {
        document.querySelector(targetElement).classList.add('hidden');
        document.querySelector(targetElement).classList.remove('animate-popUpOut');
    }, 2500);
}

function playResultAnimation(resultText) {
    document.querySelector('.resultMessage').textContent = resultText;
    document.querySelector('.handResultPopUp').classList.remove('hidden');
    document.querySelector('.handResultPopUp').classList.add('animate-popUp');
    setTimeout(() => {
        document.querySelector('.handResultPopUp').classList.add('hidden');
        document.querySelector('.handResultPopUp').classList.remove('animate-popUp');
    }, 2000);
}

function showGameEndModal(outcome) {
    if (outcome === 'outOfMoney') {
        document.querySelector('.gameEndHeader').textContent = 'Game over';
        document.querySelector('.gameEndMain').textContent = 'You lost all your money';
    } else {
        document.querySelector('.gameEndHeader').textContent = 'Congratulations';
        document.querySelector('.gameEndMain').innerHTML =
            'You finished with <span class="text-green-800">$' + (player.wallet + player.bet) + '</span>';
    }

    document.querySelector('.gameEndModal').showModal();
}
