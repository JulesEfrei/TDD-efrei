import {
  type BoardHand,
  type Deck,
  type PlayerHand,
  type Card,
  Suit,
  Rank,
} from "./Deck";

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

    const straightFlush = this.isStraightFlush(boardHand, playerHand);
    if (straightFlush) {
      return straightFlush;
    }

    const fourOfAKind = this.isFourOfAKind(boardHand, playerHand);
    if (fourOfAKind) {
      return [...fourOfAKind.quads, fourOfAKind.kicker];
    }

    const fullHouse = this.isFullHouse(boardHand, playerHand);
    if (fullHouse) {
      return fullHouse;
    }

    const flush = this.isFlush(boardHand, playerHand);
    if (flush) {
      return flush;
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

  isFullHouse(boardHand: BoardHand, playerHand: PlayerHand): Deck | null {
    this.areHandValid(boardHand, playerHand);
    const allCards = [...boardHand, ...playerHand];
    const rankCounts = new Map<number, number>();

    for (const card of allCards) {
      rankCounts.set(card.rank, (rankCounts.get(card.rank) ?? 0) + 1);
    }

    const triples = Array.from(rankCounts.entries())
      .filter(([, count]) => count >= 3)
      .map(([rank]) => rank)
      .sort((a, b) => b - a);

    if (triples.length === 0) {
      return null;
    }

    const bestTripleRank = triples[0]!;
    const pairRanks = Array.from(rankCounts.entries())
      .filter(([rank, count]) => rank !== bestTripleRank && count >= 2)
      .map(([rank]) => rank)
      .sort((a, b) => b - a);

    if (pairRanks.length === 0) {
      return null;
    }

    const bestPairRank = pairRanks[0]!;
    const tripleCards = allCards
      .filter((card) => card.rank === bestTripleRank)
      .slice(0, 3);
    const pairCards = allCards
      .filter((card) => card.rank === bestPairRank)
      .slice(0, 2);

    if (tripleCards.length !== 3 || pairCards.length !== 2) {
      return null;
    }

    return [...tripleCards, ...pairCards];
  }

  isStraightFlush(boardHand: BoardHand, playerHand: PlayerHand): Deck | null {
    this.areHandValid(boardHand, playerHand);
    const allCards = [...boardHand, ...playerHand];
    let bestHand: Deck | null = null;
    let bestHighRank = 0;

    for (const suit of [Suit.Clubs, Suit.Diamonds, Suit.Hearts, Suit.Spades]) {
      const suitCards = allCards.filter((c) => c.suit === suit);

      if (suitCards.length >= 5) {
        const straight = this.getBestStraightFromCards(suitCards);
        if (straight) {
          const highRank = this.getStraightHighRank(straight);
          if (highRank > bestHighRank) {
            bestHighRank = highRank;
            bestHand = straight;
          }
        }
      }
    }

    return bestHand;
  }

  isFlush(boardHand: BoardHand, playerHand: PlayerHand): Deck | null {
    this.areHandValid(boardHand, playerHand);
    const allCards = [...boardHand, ...playerHand];
    let bestFlush: Deck | null = null;
    let bestRanks: number[] | null = null;

    for (const suit of [Suit.Clubs, Suit.Diamonds, Suit.Hearts, Suit.Spades]) {
      const suitCards = allCards
        .filter((card) => card.suit === suit)
        .sort((a, b) => b.rank - a.rank);

      if (suitCards.length >= 5) {
        const flushHand = suitCards.slice(0, 5);
        const flushRanks = flushHand.map((card) => card.rank);

        if (!bestRanks || this.isBetterFlush(flushRanks, bestRanks)) {
          bestRanks = flushRanks;
          bestFlush = flushHand;
        }
      }
    }

    return bestFlush;
  }

  private getBestStraightFromCards(cards: Card[]): Deck | null {
    const rankToCard = new Map<number, Card>();
    for (const card of cards) {
      if (!rankToCard.has(card.rank)) {
        rankToCard.set(card.rank, card);
      }
    }

    const ranks = Array.from(rankToCard.keys()).sort((a, b) => a - b);
    let bestHighRank = 0;

    for (let i = 0; i <= ranks.length - 5; i++) {
      let isStraight = true;
      for (let j = 1; j < 5; j++) {
        if (ranks[i + j] !== ranks[i]! + j) {
          isStraight = false;
          break;
        }
      }

      if (isStraight) {
        const highRank = ranks[i + 4]!;
        if (highRank > bestHighRank) {
          bestHighRank = highRank;
        }
      }
    }

    const wheelRanks = [Rank.Ace, Rank.Two, Rank.Three, Rank.Four, Rank.Five];
    if (wheelRanks.every((r) => rankToCard.has(r))) {
      bestHighRank = Math.max(bestHighRank, Rank.Five);
    }

    if (bestHighRank === 0) {
      return null;
    }

    const straightRanks =
      bestHighRank === Rank.Five
        ? [Rank.Ace, Rank.Two, Rank.Three, Rank.Four, Rank.Five]
        : [
            bestHighRank - 4,
            bestHighRank - 3,
            bestHighRank - 2,
            bestHighRank - 1,
            bestHighRank,
          ];

    const straightCards = straightRanks
      .map((rank) => rankToCard.get(rank))
      .filter((card): card is Card => Boolean(card));

    return straightCards.length === 5 ? straightCards : null;
  }

  private getStraightHighRank(cards: Deck): number {
    const ranks = cards.map((card) => card.rank).sort((a, b) => a - b);
    const isWheel =
      ranks[0] === Rank.Two &&
      ranks[1] === Rank.Three &&
      ranks[2] === Rank.Four &&
      ranks[3] === Rank.Five &&
      ranks[4] === Rank.Ace;

    return isWheel ? Rank.Five : (ranks[ranks.length - 1] ?? 0);
  }

  private isBetterFlush(candidate: number[], current: number[]): boolean {
    for (let i = 0; i < 5; i++) {
      const candidateRank = candidate[i] ?? 0;
      const currentRank = current[i] ?? 0;

      if (candidateRank !== currentRank) {
        return candidateRank > currentRank;
      }
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
