import {type BoardHand, type Deck, type PlayerHand, type Card, Suit, Rank} from "./Deck";

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
    this.areHandValid(boardHand, playerHand);

    const fourOfAKind = this.isFourOfAKind(boardHand, playerHand);
    if (fourOfAKind) {
      return [...fourOfAKind.quads, fourOfAKind.kicker];
    }

    return boardHand;
  }

  isFourOfAKind(
    boardHand: BoardHand,
    playerHand: PlayerHand,
  ): { quads: Card[]; kicker: Card } | null {
    this.areHandValid(boardHand, playerHand);

    const allCards = [...boardHand, ...playerHand];
    const rankCounts = new Map<number, number>();

    for (const card of allCards) {
      rankCounts.set(card.rank, (rankCounts.get(card.rank) ?? 0) + 1);
    }

    let quadRank: number | null = null;
    for (const [rank, count] of rankCounts.entries()) {
      if (count === 4) {
        if (quadRank === null || rank > quadRank) {
          quadRank = rank;
        }
      }
    }

    if (quadRank === null) {
      return null;
    }

    const quads = allCards.filter((card) => card.rank === quadRank);
    const kicker = allCards
      .filter((card) => card.rank !== quadRank)
      .sort((a, b) => b.rank - a.rank)[0];

    if (!kicker) {
      return null;
    }

    return { quads, kicker };
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
