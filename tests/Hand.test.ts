import { describe, it, expect } from "vitest";
import { HandClass } from "../src/Hand";
import type { BoardHand, PlayerHand, Card } from "../src/Deck";
import { Rank, Suit } from "../src/Deck";

const hand = new HandClass();

const createBoard = (length: number): BoardHand =>
  Array.from({ length }, () => ({ rank: 2, suit: 0 }));

const createPlayer = (length: number): PlayerHand =>
  Array.from({ length }, () => ({ rank: 2, suit: 0 }));

const createCard = (rank: Rank, suit: Suit): Card => ({ rank, suit });

const normalizeHand = (cards: Card[]) =>
  cards
    .map((card) => `${card.rank}-${card.suit}`)
    .sort((a, b) => a.localeCompare(b));

const expectSameCards = (actual: Card[], expected: Card[]) => {
  expect(normalizeHand(actual)).toEqual(normalizeHand(expected));
};

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
  it("returns the best high-card hand", () => {
    const board: BoardHand = [
      createCard(Rank.Two, Suit.Clubs),
      createCard(Rank.Five, Suit.Diamonds),
      createCard(Rank.Seven, Suit.Hearts),
      createCard(Rank.Jack, Suit.Spades),
      createCard(Rank.King, Suit.Clubs),
    ];
    const player: PlayerHand = [
      createCard(Rank.Three, Suit.Hearts),
      createCard(Rank.Nine, Suit.Diamonds),
    ];

    expect(hand.areHandValid(board, player)).toBe(true);

    const bestHand = hand.checkBestPlayerHand(board, player);
    const expected = [
      createCard(Rank.King, Suit.Clubs),
      createCard(Rank.Jack, Suit.Spades),
      createCard(Rank.Nine, Suit.Diamonds),
      createCard(Rank.Seven, Suit.Hearts),
      createCard(Rank.Five, Suit.Diamonds),
    ];

    expect(bestHand).toHaveLength(5);
    expectSameCards(bestHand, expected);
  });

  it("returns the best one-pair hand", () => {
    const board: BoardHand = [
      createCard(Rank.Two, Suit.Clubs),
      createCard(Rank.Five, Suit.Diamonds),
      createCard(Rank.Seven, Suit.Hearts),
      createCard(Rank.Jack, Suit.Spades),
      createCard(Rank.King, Suit.Clubs),
    ];
    const player: PlayerHand = [
      createCard(Rank.King, Suit.Hearts),
      createCard(Rank.Nine, Suit.Diamonds),
    ];

    expect(hand.areHandValid(board, player)).toBe(true);

    const bestHand = hand.checkBestPlayerHand(board, player);
    const expected = [
      createCard(Rank.King, Suit.Clubs),
      createCard(Rank.King, Suit.Hearts),
      createCard(Rank.Jack, Suit.Spades),
      createCard(Rank.Nine, Suit.Diamonds),
      createCard(Rank.Seven, Suit.Hearts),
    ];

    expect(bestHand).toHaveLength(5);
    expectSameCards(bestHand, expected);
  });

  it("returns the best two-pair hand", () => {
    const board: BoardHand = [
      createCard(Rank.Two, Suit.Clubs),
      createCard(Rank.Five, Suit.Diamonds),
      createCard(Rank.Seven, Suit.Hearts),
      createCard(Rank.Jack, Suit.Spades),
      createCard(Rank.Jack, Suit.Diamonds),
    ];
    const player: PlayerHand = [
      createCard(Rank.Five, Suit.Hearts),
      createCard(Rank.King, Suit.Clubs),
    ];

    expect(hand.areHandValid(board, player)).toBe(true);

    const bestHand = hand.checkBestPlayerHand(board, player);
    const expected = [
      createCard(Rank.Jack, Suit.Spades),
      createCard(Rank.Jack, Suit.Diamonds),
      createCard(Rank.Five, Suit.Diamonds),
      createCard(Rank.Five, Suit.Hearts),
      createCard(Rank.King, Suit.Clubs),
    ];

    expect(bestHand).toHaveLength(5);
    expectSameCards(bestHand, expected);
  });

  it("returns the best three-of-a-kind hand", () => {
    const board: BoardHand = [
      createCard(Rank.Two, Suit.Clubs),
      createCard(Rank.Seven, Suit.Diamonds),
      createCard(Rank.Seven, Suit.Hearts),
      createCard(Rank.Jack, Suit.Spades),
      createCard(Rank.King, Suit.Clubs),
    ];
    const player: PlayerHand = [
      createCard(Rank.Seven, Suit.Clubs),
      createCard(Rank.Nine, Suit.Diamonds),
    ];

    expect(hand.areHandValid(board, player)).toBe(true);

    const bestHand = hand.checkBestPlayerHand(board, player);
    const expected = [
      createCard(Rank.Seven, Suit.Diamonds),
      createCard(Rank.Seven, Suit.Hearts),
      createCard(Rank.Seven, Suit.Clubs),
      createCard(Rank.King, Suit.Clubs),
      createCard(Rank.Jack, Suit.Spades),
    ];

    expect(bestHand).toHaveLength(5);
    expectSameCards(bestHand, expected);
  });

  it("returns the best straight", () => {
    const board: BoardHand = [
      createCard(Rank.Two, Suit.Clubs),
      createCard(Rank.Three, Suit.Diamonds),
      createCard(Rank.Four, Suit.Hearts),
      createCard(Rank.Nine, Suit.Spades),
      createCard(Rank.King, Suit.Clubs),
    ];
    const player: PlayerHand = [
      createCard(Rank.Five, Suit.Hearts),
      createCard(Rank.Six, Suit.Diamonds),
    ];

    expect(hand.areHandValid(board, player)).toBe(true);

    const bestHand = hand.checkBestPlayerHand(board, player);
    const expected = [
      createCard(Rank.Two, Suit.Clubs),
      createCard(Rank.Three, Suit.Diamonds),
      createCard(Rank.Four, Suit.Hearts),
      createCard(Rank.Five, Suit.Hearts),
      createCard(Rank.Six, Suit.Diamonds),
    ];

    expect(bestHand).toHaveLength(5);
    expectSameCards(bestHand, expected);
  });

  it("returns the best flush", () => {
    const board: BoardHand = [
      createCard(Rank.Ace, Suit.Hearts),
      createCard(Rank.Nine, Suit.Hearts),
      createCard(Rank.Six, Suit.Hearts),
      createCard(Rank.Three, Suit.Hearts),
      createCard(Rank.Two, Suit.Hearts),
    ];
    const player: PlayerHand = [
      createCard(Rank.King, Suit.Hearts),
      createCard(Rank.Seven, Suit.Clubs),
    ];

    expect(hand.areHandValid(board, player)).toBe(true);

    const bestHand = hand.checkBestPlayerHand(board, player);
    const expected = [
      createCard(Rank.Ace, Suit.Hearts),
      createCard(Rank.King, Suit.Hearts),
      createCard(Rank.Nine, Suit.Hearts),
      createCard(Rank.Six, Suit.Hearts),
      createCard(Rank.Three, Suit.Hearts),
    ];

    expect(bestHand).toHaveLength(5);
    expectSameCards(bestHand, expected);
  });

  it("returns the best full house", () => {
    const board: BoardHand = [
      createCard(Rank.Two, Suit.Clubs),
      createCard(Rank.Two, Suit.Diamonds),
      createCard(Rank.Two, Suit.Hearts),
      createCard(Rank.Nine, Suit.Spades),
      createCard(Rank.King, Suit.Clubs),
    ];
    const player: PlayerHand = [
      createCard(Rank.Nine, Suit.Hearts),
      createCard(Rank.Nine, Suit.Diamonds),
    ];

    expect(hand.areHandValid(board, player)).toBe(true);

    const bestHand = hand.checkBestPlayerHand(board, player);
    const expected = [
      createCard(Rank.Nine, Suit.Spades),
      createCard(Rank.Nine, Suit.Hearts),
      createCard(Rank.Nine, Suit.Diamonds),
      createCard(Rank.Two, Suit.Clubs),
      createCard(Rank.Two, Suit.Diamonds),
    ];

    expect(bestHand).toHaveLength(5);
    expectSameCards(bestHand, expected);
  });

  it("returns the best four-of-a-kind hand", () => {
    const board: BoardHand = [
      createCard(Rank.Eight, Suit.Clubs),
      createCard(Rank.Eight, Suit.Diamonds),
      createCard(Rank.Eight, Suit.Hearts),
      createCard(Rank.King, Suit.Spades),
      createCard(Rank.Two, Suit.Clubs),
    ];
    const player: PlayerHand = [
      createCard(Rank.Eight, Suit.Spades),
      createCard(Rank.Ace, Suit.Diamonds),
    ];

    expect(hand.areHandValid(board, player)).toBe(true);

    const bestHand = hand.checkBestPlayerHand(board, player);
    const expected = [
      createCard(Rank.Eight, Suit.Clubs),
      createCard(Rank.Eight, Suit.Diamonds),
      createCard(Rank.Eight, Suit.Hearts),
      createCard(Rank.Eight, Suit.Spades),
      createCard(Rank.Ace, Suit.Diamonds),
    ];

    expect(bestHand).toHaveLength(5);
    expectSameCards(bestHand, expected);
  });

  it("returns the best straight flush", () => {
    const board: BoardHand = [
      createCard(Rank.Nine, Suit.Hearts),
      createCard(Rank.Ten, Suit.Hearts),
      createCard(Rank.Jack, Suit.Hearts),
      createCard(Rank.Two, Suit.Clubs),
      createCard(Rank.King, Suit.Diamonds),
    ];
    const player: PlayerHand = [
      createCard(Rank.Queen, Suit.Hearts),
      createCard(Rank.Eight, Suit.Hearts),
    ];

    expect(hand.areHandValid(board, player)).toBe(true);

    const bestHand = hand.checkBestPlayerHand(board, player);
    const expected = [
      createCard(Rank.Eight, Suit.Hearts),
      createCard(Rank.Nine, Suit.Hearts),
      createCard(Rank.Ten, Suit.Hearts),
      createCard(Rank.Jack, Suit.Hearts),
      createCard(Rank.Queen, Suit.Hearts),
    ];

    expect(bestHand).toHaveLength(5);
    expectSameCards(bestHand, expected);
  });

  it("throws when hands are invalid", () => {
    const board = createBoard(4);
    const player = createPlayer(2);

    expect(() => hand.checkBestPlayerHand(board, player)).toThrow(
      "Hand are invalid",
    );
  });
});

describe("isFourOfAKind", () => {
  it("returns true when four cards share a rank", () => {
    const board: BoardHand = [
      createCard(Rank.Nine, Suit.Clubs),
      createCard(Rank.Nine, Suit.Diamonds),
      createCard(Rank.Nine, Suit.Hearts),
      createCard(Rank.King, Suit.Spades),
      createCard(Rank.Two, Suit.Clubs),
    ];
    const player: PlayerHand = [
      createCard(Rank.Nine, Suit.Spades),
      createCard(Rank.Ace, Suit.Diamonds),
    ];

    expect(hand.areHandValid(board, player)).toBe(true);
    const result = hand.isFourOfAKind(board, player);

    expect(result).not.toBeNull();
    expect(result?.quads).toHaveLength(4);
    expect(result?.kicker.rank).toBe(Rank.Ace);
  });

  it("returns false when no four of a kind exists", () => {
    const board: BoardHand = [
      createCard(Rank.Ten, Suit.Clubs),
      createCard(Rank.Ten, Suit.Diamonds),
      createCard(Rank.Ten, Suit.Hearts),
      createCard(Rank.King, Suit.Spades),
      createCard(Rank.Two, Suit.Clubs),
    ];
    const player: PlayerHand = [
      createCard(Rank.Nine, Suit.Spades),
      createCard(Rank.Ace, Suit.Diamonds),
    ];

    expect(hand.areHandValid(board, player)).toBe(true);
    expect(hand.isFourOfAKind(board, player)).toBeNull();
  });

  it("throws when hands are invalid", () => {
    const board = createBoard(4);
    const player = createPlayer(2);

    expect(() => hand.isFourOfAKind(board, player)).toThrow(
      "Hand are invalid",
    );
  });
});

describe("checkBestPlayerHand four of a kind", () => {
  it("returns the best 5-card hand when four of a kind exists", () => {
    const board: BoardHand = [
      createCard(Rank.Nine, Suit.Clubs),
      createCard(Rank.Nine, Suit.Diamonds),
      createCard(Rank.Nine, Suit.Hearts),
      createCard(Rank.King, Suit.Spades),
      createCard(Rank.Two, Suit.Clubs),
    ];
    const player: PlayerHand = [
      createCard(Rank.Nine, Suit.Spades),
      createCard(Rank.Ace, Suit.Diamonds),
    ];

    expect(hand.areHandValid(board, player)).toBe(true);

    const bestHand = hand.checkBestPlayerHand(board, player);
    const nineCount = bestHand.filter((card) => card.rank === Rank.Nine).length;
    const hasAce = bestHand.some((card) => card.rank === Rank.Ace);

    expect(bestHand).toHaveLength(5);
    expect(nineCount).toBe(4);
    expect(hasAce).toBe(true);
  });
});
