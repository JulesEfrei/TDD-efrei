import { describe, expect, it } from "vitest";
import { Poker } from "../src/Poker";
import { HandClass } from "../src/Hand";
import { RandomPoker } from "../src/Random";
import { Rank, Suit, type BoardHand, type PlayerHand } from "../src/Deck";

const ranks = (cards: { rank: number }[]) =>
  cards.map((card) => card.rank).sort((a, b) => b - a);

describe("Poker compareHands", () => {
  it("returns Player 1 when the best hand ranks higher", () => {
    const poker = new Poker(new RandomPoker(), new HandClass());

    const board: BoardHand = [
      { rank: Rank.Six, suit: Suit.Hearts },
      { rank: Rank.Seven, suit: Suit.Hearts },
      { rank: Rank.Eight, suit: Suit.Hearts },
      { rank: Rank.Nine, suit: Suit.Hearts },
      { rank: Rank.Nine, suit: Suit.Clubs },
    ];

    const player1: PlayerHand = [
      { rank: Rank.Ten, suit: Suit.Hearts },
      { rank: Rank.Ace, suit: Suit.Diamonds },
    ];

    const player2: PlayerHand = [
      { rank: Rank.Nine, suit: Suit.Spades },
      { rank: Rank.Nine, suit: Suit.Diamonds },
    ];

    const result = poker.compareHands(board, player1, player2);

    expect(result.winners).toEqual(["Player 1"]);
    expect(result.player1BestHand).toHaveLength(5);
    expect(result.player2BestHand).toHaveLength(5);
    expect(ranks(result.player1BestHand)[0]).toBeGreaterThan(
      ranks(result.player2BestHand)[0] ?? 0,
    );
  });

  it("returns a tie when the board already has the best hand", () => {
    const poker = new Poker(new RandomPoker(), new HandClass());

    const board: BoardHand = [
      { rank: Rank.Two, suit: Suit.Clubs },
      { rank: Rank.Three, suit: Suit.Diamonds },
      { rank: Rank.Four, suit: Suit.Hearts },
      { rank: Rank.Five, suit: Suit.Spades },
      { rank: Rank.Six, suit: Suit.Clubs },
    ];

    const player1: PlayerHand = [
      { rank: Rank.Ace, suit: Suit.Diamonds },
      { rank: Rank.King, suit: Suit.Hearts },
    ];

    const player2: PlayerHand = [
      { rank: Rank.Queen, suit: Suit.Diamonds },
      { rank: Rank.Jack, suit: Suit.Hearts },
    ];

    const result = poker.compareHands(board, player1, player2);

    expect(result.winners).toEqual(["Player 1", "Player 2"]);
    expect(ranks(result.player1BestHand)).toEqual(
      ranks(result.player2BestHand),
    );
  });
});
