import { describe, it, expect } from "vitest";
import { HandClass } from "../src/Hand";
import { Rank, Suit, type BoardHand, type PlayerHand } from "../src/Deck";

const hand = new HandClass();

const createBoard = (length: number): BoardHand =>
  Array.from({ length }, () => ({ rank: 2, suit: 0 }));

const createPlayer = (length: number): PlayerHand =>
  Array.from({ length }, () => ({ rank: 2, suit: 0 }));

describe("Hand validation", () => {
  it("returns true for valid board and player hands", () => {
    const board = createBoard(5);
    const player = createPlayer(2);

    expect(hand.areHandValid(board, player)).toBe(true);
  });

  it("throws when board hand is invalid", () => {
    const board = createBoard(4);
    const player = createPlayer(2);

    expect(() => hand.areHandValid(board, player)).toThrow("Hand are invalid");
  });

  it("throws when player hand is invalid", () => {
    const board = createBoard(5);
    const player = createPlayer(3);

    expect(() => hand.areHandValid(board, player)).toThrow("Hand are invalid");
  });

  it("throws when board AND player hands are invalid", () => {
    const board = createBoard(4);
    const player = createPlayer(4);

    expect(() => hand.areHandValid(board, player)).toThrow("Hand are invalid");
  });

  it("throws when player hand is invalid", () => {
    const board = createBoard(5);
    const player = createPlayer(3);

    expect(() => hand.areHandValid(board, player)).toThrow("Hand are invalid");
  });
});

describe("Board and player hand helpers", () => {
  it("validates board hand length", () => {
    expect(hand.isBoardHandValid(createBoard(5))).toBe(true);
    expect(hand.isBoardHandValid(createBoard(4))).toBe(false);
  });

  it("validates player hand length", () => {
    expect(hand.isPlayerHandValid(createPlayer(2))).toBe(true);
    expect(hand.isPlayerHandValid(createPlayer(1))).toBe(false);
  });
});

describe("checkBestPlayerHand", () => {
  it("returns the board hand as-is", () => {
    const board = createBoard(5);
    const player = createPlayer(2);

    expect(hand.checkBestPlayerHand(board, player)).toBe(board);
  });
});


describe("isStraightFlush", () => {
  it("should return true for a valid Straight Flush (Hearts 6 to 10)", () => {
    const board: BoardHand = [
      { rank: Rank.Six, suit: Suit.Hearts },
      { rank: Rank.Seven, suit: Suit.Hearts },
      { rank: Rank.Eight, suit: Suit.Hearts },
      { rank: Rank.Nine, suit: Suit.Hearts },
      { rank: Rank.Two, suit: Suit.Clubs },
    ];

    const player: PlayerHand = [
      { rank: Rank.Ten, suit: Suit.Hearts },
      { rank: Rank.Ace, suit: Suit.Spades },
    ];

    expect(hand.isStraightFlush(board, player)).toBe(true);
  });

  it("should return false for a Straight that is not a Flush", () => {
    const board: BoardHand = [
      { rank: Rank.Six, suit: Suit.Hearts },
      { rank: Rank.Seven, suit: Suit.Hearts },
      { rank: Rank.Eight, suit: Suit.Hearts },
      { rank: Rank.Nine, suit: Suit.Hearts },
      { rank: Rank.Two, suit: Suit.Clubs },
    ];

    const player: PlayerHand = [
      { rank: Rank.Ten, suit: Suit.Spades },
      { rank: Rank.Ace, suit: Suit.Diamonds },
    ];

    expect(hand.isStraightFlush(board, player)).toBe(false);
  });

  it("should return false for a Flush that is not a Straight", () => {
    const board: BoardHand = [
      { rank: Rank.Two, suit: Suit.Hearts },
      { rank: Rank.Four, suit: Suit.Hearts },
      { rank: Rank.Six, suit: Suit.Hearts },
      { rank: Rank.Eight, suit: Suit.Hearts },
      { rank: Rank.King, suit: Suit.Hearts },
    ];

    const player: PlayerHand = [
      { rank: Rank.Ace, suit: Suit.Clubs },
      { rank: Rank.Jack, suit: Suit.Spades },
    ];

    expect(hand.isStraightFlush(board, player)).toBe(false);
  });
});