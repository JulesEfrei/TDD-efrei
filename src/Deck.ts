export enum Suit {
  Clubs = 0,
  Diamonds = 1,
  Hearts = 2,
  Spades = 3,
}

export enum Rank {
  Two = 2,
  Three = 3,
  Four = 4,
  Five = 5,
  Six = 6,
  Seven = 7,
  Eight = 8,
  Nine = 9,
  Ten = 10,
  Jack = 11,
  Queen = 12,
  King = 13,
  Ace = 14,
}

export type Card = {
  rank: Rank;
  suit: Suit;
};

export type Deck = Card[];
export type BoardHand = Deck;
export type PlayerHand = Deck;

interface DeckGeneratorInterface {
  generateDeck(): Deck;
  generateCardsForSuit(suit: Suit): Deck;
}

export class DeckGenerator implements DeckGeneratorInterface {
  generateDeck() {
    let deck: Deck = [];

    const suits = Object.values(Suit).filter(
      (value): value is Suit => typeof value === "number",
    );

    for (const suit of suits) {
      const suitDeck: Deck = this.generateCardsForSuit(suit);
      deck.push(...suitDeck);
    }

    return deck;
  }

  generateCardsForSuit(suit: Suit): Deck {
    let deck: Deck = [];

    const ranks = Object.values(Rank).filter(
      (value): value is Rank => typeof value === "number",
    );

    for (const rank of ranks) {
      const card: Card = { rank: rank, suit: suit };
      deck.push(card);
    }

    return deck;
  }
}
