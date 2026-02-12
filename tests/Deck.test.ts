import { describe, it, expect } from "vitest";
import { DeckGenerator, Suit } from "../src/Deck";

const deckGenerator = new DeckGenerator();

describe("Generate a card game", () => {
  describe("Generate suit deck", () => {
    it("should generate a deck of 13 cards", () => {
      const spadesDeck = deckGenerator.generateCardsForSuit(Suit.Spades);
      expect(spadesDeck.length).toBe(13);
    });
  });

  it("should generate a deck of 52 cards", () => {
    const deck = deckGenerator.generateDeck();
    expect(deck.length).toBe(52);
  });

  it("should have equal card number for each suit", () => {
    const deck = deckGenerator.generateDeck();
    expect(deck.filter((card) => card.suit === 0).length).toBe(13);
    expect(deck.filter((card) => card.suit === 1).length).toBe(13);
    expect(deck.filter((card) => card.suit === 2).length).toBe(13);
    expect(deck.filter((card) => card.suit === 3).length).toBe(13);
  });
});
