import { describe, it, expect } from "vitest";
import { RandomPoker } from "../src/Random";

const randomPoker = new RandomPoker();

describe("Random Poker Dealer", () => {
  it("should deal 5 cards for the board and 2 cards per player", () => {
    const { board, player1, player2 } = randomPoker.dealHand();

    expect(board).toHaveLength(5);
    expect(player1).toHaveLength(2);
    expect(player2).toHaveLength(2);
  });

  it("should not contain duplicate cards in a single deal", () => {
    const { board, player1, player2 } = randomPoker.dealHand();
    const allDealtCards = [...board, ...player1, ...player2];

    const uniqueCards = new Set(
      allDealtCards.map((c) => `${c.rank}-${c.suit}`),
    );

    expect(uniqueCards.size).toBe(9);
  });
});

