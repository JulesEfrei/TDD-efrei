import { describe, it, expect } from "vitest";
import { HandClass } from "../src/Hand";
import type { BoardHand, PlayerHand } from "../src/Deck";

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
