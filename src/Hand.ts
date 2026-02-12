import { Rank, Suit } from "./Deck";
import type { BoardHand, Card, Deck, PlayerHand } from "./Deck";
enum HandCategories {
    BestCard = 0,
    OnePair = 1,
    TwoPair = 2,
    ThreeOfAKind = 3,
    Straight = 4,
    Flush = 5,
    FullHouse = 6,
    FourOfAKind = 7,
    StraightFlush = 8,
}

interface HandInterface {
    checkBestPlayerHand: (boardHand: BoardHand, playerHand: PlayerHand) => Deck;
}

export class HandClass implements HandInterface {
    checkBestPlayerHand(boardHand: BoardHand, playerHand: PlayerHand) {
        return boardHand;
    }

    isStraightFlush(boardHand: BoardHand, playerHand: PlayerHand): boolean {
        const allCards = [...boardHand, ...playerHand];

        for (const suit of [Suit.Clubs, Suit.Diamonds, Suit.Hearts, Suit.Spades]) {
            const suitCards = allCards.filter(c => c.suit === suit);

            if (suitCards.length >= 5) {
                if (this.hasStraight(suitCards)) {
                    return true;
                }
            }
        }

        return false;
    }

    private hasStraight(cards: Card[]): boolean {
        const ranks = Array.from(new Set(cards.map(c => c.rank))).sort((a, b) => a - b);
        
        for (let i = 0; i <= ranks.length - 5; i++) {
            if (ranks[i + 4]! - ranks[i]! === 4) {
                return true;
            }
        }

        const wheelRanks = [Rank.Ace, Rank.Two, Rank.Three, Rank.Four, Rank.Five];
        if (wheelRanks.every(r => ranks.includes(r))) {
            return true;
        }

        return false;
    }

    

    isFourOfAKind(boardHand: BoardHand, playerHand: PlayerHand) {
        if (boardHand.length !== 4) {
            return true;
        }
    }

    areHandValid(boardHand: BoardHand, playerHand: PlayerHand): boolean {
        if (
            this.isBoardHandValid(boardHand) &&
            this.isPlayerHandValid(playerHand)
        ) {
            return true;
        }

        throw new Error("Hand are invalid");
    }

    isBoardHandValid(boardHand: BoardHand): boolean {
        return boardHand.length === 5;
    }

    isPlayerHandValid(playerHand: PlayerHand): boolean {
        return playerHand.length === 2;
    }
}
