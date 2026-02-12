import { describe, it, expect } from "vitest";
import { dealHand } from "../src/random";

describe('Random Poker Dealer', () => {
    it('should deal 5 cards for the board and 2 cards per player', () => {
        const { board, player1Hole, player2Hole } = dealHand();

        expect(board).toHaveLength(5);
        expect(player1Hole).toHaveLength(2);
        expect(player2Hole).toHaveLength(2);
    });

    it('should not contain duplicate cards in a single deal', () => {
        const { board, player1Hole, player2Hole } = dealHand();
        const allDealtCards = [...board, ...player1Hole, ...player2Hole];

        const uniqueCards = new Set(
            allDealtCards.map(c => `${c.rank}-${c.suit}`)
        );

        expect(uniqueCards.size).toBe(9);
    });
});