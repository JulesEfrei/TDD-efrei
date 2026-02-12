import { describe, it, expect } from "vitest";
import { DeckGenerator, Suit } from "../src/Deck";

const deckGenerator = new DeckGenerator();

describe("Generate a card game", () => {
  describe("Generate suit deck", () => {
    it("should generate a deck of 13 cards", () => {
      const spadesDeck = deckGenerator.generateCardsForSuit(Suit.Spades);
      expect(spadesDeck).toHaveLength(13);
    });
  });

  it("should generate a deck of 52 cards", () => {
    const deck = deckGenerator.generateDeck();
    expect(deck).toHaveLength(52);
  });

  it("should have equal card number for each suit", () => {
    const deck = deckGenerator.generateDeck();
    expect(deck.filter((card) => card.suit === 0)).toHaveLength(13);
    expect(deck.filter((card) => card.suit === 2)).toHaveLength(13);
    expect(deck.filter((card) => card.suit === 3)).toHaveLength(13);
  });
});
