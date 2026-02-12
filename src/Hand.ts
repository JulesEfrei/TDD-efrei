import {
  type BoardHand,
  type Deck,
  type PlayerHand,
  type Card,
  Suit,
  Rank,
} from "./Deck";

export enum HandCategories {
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

type HandContext = {
  allCards: Card[];
  rankCounts: Map<number, number>;
  cardsByRank: Map<number, Card[]>;
  cardsBySuit: Map<Suit, Card[]>;
  cardsBySuitSorted: Map<Suit, Card[]>;
  sortedByRankDesc: Card[];
};

export class HandClass implements HandInterface {
  checkBestPlayerHand(boardHand: BoardHand, playerHand: PlayerHand) {
    this.areHandValid(boardHand, playerHand);
    const context = this.buildContext(boardHand, playerHand);

    const straightFlush = this.getStraightFlushFromContext(context);
    if (straightFlush) {
      return straightFlush;
    }

    const fourOfAKind = this.getFourOfAKindFromContext(context);
    if (fourOfAKind) {
      return [...fourOfAKind.quads, fourOfAKind.kicker];
    }

    const fullHouse = this.getFullHouseFromContext(context);
    if (fullHouse) {
      return fullHouse;
    }

    const flush = this.getFlushFromContext(context);
    if (flush) {
      return flush;
    }

    const straight = this.getStraightFromContext(context);
    if (straight) {
      return straight;
    }

    const threeOfAKind = this.getThreeOfAKindFromContext(context);
    if (threeOfAKind) {
      return threeOfAKind;
    }

    const twoPair = this.getTwoPairFromContext(context);
    if (twoPair) {
      return twoPair;
    }

    const onePair = this.getOnePairFromContext(context);
    if (onePair) {
      return onePair;
    }

    return this.getBestCardFromContext(context);
  }

  isFourOfAKind(
    boardHand: BoardHand,
    playerHand: PlayerHand,
  ): { quads: Card[]; kicker: Card } | null {
    this.areHandValid(boardHand, playerHand);
    const context = this.buildContext(boardHand, playerHand);
    return this.getFourOfAKindFromContext(context);
  }

  isFullHouse(boardHand: BoardHand, playerHand: PlayerHand): Deck | null {
    this.areHandValid(boardHand, playerHand);
    const context = this.buildContext(boardHand, playerHand);
    return this.getFullHouseFromContext(context);
  }

  isStraightFlush(boardHand: BoardHand, playerHand: PlayerHand): Deck | null {
    this.areHandValid(boardHand, playerHand);
    const context = this.buildContext(boardHand, playerHand);
    return this.getStraightFlushFromContext(context);
  }

  isFlush(boardHand: BoardHand, playerHand: PlayerHand): Deck | null {
    this.areHandValid(boardHand, playerHand);
    const context = this.buildContext(boardHand, playerHand);
    return this.getFlushFromContext(context);
  }

  isStraight(boardHand: BoardHand, playerHand: PlayerHand): Deck | null {
    this.areHandValid(boardHand, playerHand);
    const context = this.buildContext(boardHand, playerHand);
    return this.getStraightFromContext(context);
  }

  isThreeOfAKind(boardHand: BoardHand, playerHand: PlayerHand): Deck | null {
    this.areHandValid(boardHand, playerHand);
    const context = this.buildContext(boardHand, playerHand);
    return this.getThreeOfAKindFromContext(context);
  }

  isTwoPair(boardHand: BoardHand, playerHand: PlayerHand): Deck | null {
    this.areHandValid(boardHand, playerHand);
    const context = this.buildContext(boardHand, playerHand);
    return this.getTwoPairFromContext(context);
  }

  isOnePair(boardHand: BoardHand, playerHand: PlayerHand): Deck | null {
    this.areHandValid(boardHand, playerHand);
    const context = this.buildContext(boardHand, playerHand);
    return this.getOnePairFromContext(context);
  }

  isBestCard(boardHand: BoardHand, playerHand: PlayerHand): Deck {
    this.areHandValid(boardHand, playerHand);
    const context = this.buildContext(boardHand, playerHand);
    return this.getBestCardFromContext(context);
  }

  private buildContext(boardHand: BoardHand, playerHand: PlayerHand): HandContext {
    const allCards = [...boardHand, ...playerHand];
    const rankCounts = new Map<number, number>();
    const cardsByRank = new Map<number, Card[]>();
    const cardsBySuit = new Map<Suit, Card[]>([
      [Suit.Clubs, []],
      [Suit.Diamonds, []],
      [Suit.Hearts, []],
      [Suit.Spades, []],
    ]);

    for (const card of allCards) {
      rankCounts.set(card.rank, (rankCounts.get(card.rank) ?? 0) + 1);
      const rankCards = cardsByRank.get(card.rank);
      if (rankCards) {
        rankCards.push(card);
      } else {
        cardsByRank.set(card.rank, [card]);
      }

      const suitCards = cardsBySuit.get(card.suit);
      if (suitCards) {
        suitCards.push(card);
      }
    }

    const cardsBySuitSorted = new Map<Suit, Card[]>();
    for (const [suit, suitCards] of cardsBySuit.entries()) {
      cardsBySuitSorted.set(
        suit,
        [...suitCards].sort((a, b) => b.rank - a.rank),
      );
    }

    const sortedByRankDesc = [...allCards].sort((a, b) => b.rank - a.rank);

    return {
      allCards,
      rankCounts,
      cardsByRank,
      cardsBySuit,
      cardsBySuitSorted,
      sortedByRankDesc,
    };
  }

  private getStraightFlushFromContext(context: HandContext): Deck | null {
    let bestHand: Deck | null = null;
    let bestHighRank = 0;

    for (const suit of [Suit.Clubs, Suit.Diamonds, Suit.Hearts, Suit.Spades]) {
      const suitCards = context.cardsBySuit.get(suit) ?? [];
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

  private getFourOfAKindFromContext(
    context: HandContext,
  ): { quads: Card[]; kicker: Card } | null {
    let quadRank: number | null = null;
    for (const [rank, count] of context.rankCounts.entries()) {
      if (count === 4) {
        if (quadRank === null || rank > quadRank) {
          quadRank = rank;
        }
      }
    }

    if (quadRank === null) {
      return null;
    }

    const quads = context.cardsByRank.get(quadRank) ?? [];
    const kicker = context.sortedByRankDesc.find(
      (card) => card.rank !== quadRank,
    );

    if (!kicker || quads.length < 4) {
      return null;
    }

    return { quads: quads.slice(0, 4), kicker };
  }

  private getFullHouseFromContext(context: HandContext): Deck | null {
    const triples = Array.from(context.rankCounts.entries())
      .filter(([, count]) => count >= 3)
      .map(([rank]) => rank)
      .sort((a, b) => b - a);

    if (triples.length === 0) {
      return null;
    }

    const bestTripleRank = triples[0]!;
    const pairRanks = Array.from(context.rankCounts.entries())
      .filter(([rank, count]) => rank !== bestTripleRank && count >= 2)
      .map(([rank]) => rank)
      .sort((a, b) => b - a);

    if (pairRanks.length === 0) {
      return null;
    }

    const bestPairRank = pairRanks[0]!;
    const tripleCards = (context.cardsByRank.get(bestTripleRank) ?? []).slice(
      0,
      3,
    );
    const pairCards = (context.cardsByRank.get(bestPairRank) ?? []).slice(0, 2);

    if (tripleCards.length !== 3 || pairCards.length !== 2) {
      return null;
    }

    return [...tripleCards, ...pairCards];
  }

  private getFlushFromContext(context: HandContext): Deck | null {
    let bestFlush: Deck | null = null;
    let bestRanks: number[] | null = null;

    for (const suit of [Suit.Clubs, Suit.Diamonds, Suit.Hearts, Suit.Spades]) {
      const suitCards = context.cardsBySuitSorted.get(suit) ?? [];
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

  private getStraightFromContext(context: HandContext): Deck | null {
    return this.getBestStraightFromCards(context.allCards);
  }

  private getThreeOfAKindFromContext(context: HandContext): Deck | null {
    const tripleRanks = Array.from(context.rankCounts.entries())
      .filter(([, count]) => count >= 3)
      .map(([rank]) => rank)
      .sort((a, b) => b - a);

    if (tripleRanks.length === 0) {
      return null;
    }

    const bestTripleRank = tripleRanks[0]!;
    const tripleCards = (context.cardsByRank.get(bestTripleRank) ?? []).slice(
      0,
      3,
    );

    if (tripleCards.length !== 3) {
      return null;
    }

    const kickers = context.sortedByRankDesc
      .filter((card) => card.rank !== bestTripleRank)
      .slice(0, 2);

    if (kickers.length !== 2) {
      return null;
    }

    return [...tripleCards, ...kickers];
  }

  private getTwoPairFromContext(context: HandContext): Deck | null {
    const pairRanks = Array.from(context.rankCounts.entries())
      .filter(([, count]) => count >= 2)
      .map(([rank]) => rank)
      .sort((a, b) => b - a);

    if (pairRanks.length < 2) {
      return null;
    }

    const bestPairRanks = pairRanks.slice(0, 2);
    const selectedPairs: Card[] = [];
    for (const rank of bestPairRanks) {
      const cardsForRank = context.cardsByRank.get(rank) ?? [];
      selectedPairs.push(...cardsForRank.slice(0, 2));
    }

    if (selectedPairs.length !== 4) {
      return null;
    }

    const kicker = context.sortedByRankDesc.find(
      (card) => !bestPairRanks.includes(card.rank),
    );

    if (!kicker) {
      return null;
    }

    return [...selectedPairs, kicker];
  }

  private getOnePairFromContext(context: HandContext): Deck | null {
    const pairRanks = Array.from(context.rankCounts.entries())
      .filter(([, count]) => count >= 2)
      .map(([rank]) => rank)
      .sort((a, b) => b - a);

    if (pairRanks.length === 0) {
      return null;
    }

    const bestPairRank = pairRanks[0]!;
    const pairCards = (context.cardsByRank.get(bestPairRank) ?? []).slice(0, 2);

    if (pairCards.length !== 2) {
      return null;
    }

    const kickers = context.sortedByRankDesc
      .filter((card) => card.rank !== bestPairRank)
      .slice(0, 3);

    if (kickers.length !== 3) {
      return null;
    }

    return [...pairCards, ...kickers];
  }

  private getBestCardFromContext(context: HandContext): Deck {
    return context.sortedByRankDesc.slice(0, 5);
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
