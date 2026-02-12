import { RandomPoker } from "./Random";
import { HandClass } from "./Hand";
import type { BoardHand, PlayerHand, Deck } from "./Deck";

export type GameResult = {
	winners: string[];
	player1BestHand: Deck;
	player2BestHand: Deck;
};

export class Poker {
	private randomPoker: RandomPoker;
	private handEvaluator: HandClass;

	constructor(randomPoker: RandomPoker, handEvaluator: HandClass) {
		this.randomPoker = randomPoker;
		this.handEvaluator = handEvaluator;
	}

	compareHands(
		board: BoardHand,
		p1Hole: PlayerHand,
		p2Hole: PlayerHand,
	): GameResult {
		const p1Best = this.handEvaluator.checkBestPlayerHand(board, p1Hole);
		const p2Best = this.handEvaluator.checkBestPlayerHand(board, p2Hole);

		const comparison = this.compareBestHands(p1Best, p2Best);

		let winners: string[] = [];
		if (comparison > 0) {
			winners = ["Player 1"];
		} else if (comparison < 0) {
			winners = ["Player 2"];
		} else {
			winners = ["Player 1", "Player 2"];
		}

		return {
			winners,
			player1BestHand: p1Best,
			player2BestHand: p2Best,
		};
	}

	private compareBestHands(a: Deck, b: Deck): number {
		const ranksA = this.normalizeRanks(a);
		const ranksB = this.normalizeRanks(b);

		for (let i = 0; i < 5; i++) {
			const rankA = ranksA[i] ?? 0;
			const rankB = ranksB[i] ?? 0;

			if (rankA !== rankB) {
				return rankA - rankB;
			}
		}

		return 0;
	}

	private normalizeRanks(cards: Deck): number[] {
		const ranks = cards.map((card) => card.rank).sort((a, b) => b - a);

		const isWheel =
			ranks.length === 5 &&
			ranks[0] === 14 &&
			ranks[1] === 5 &&
			ranks[2] === 4 &&
			ranks[3] === 3 &&
			ranks[4] === 2;

		if (!isWheel) {
			return ranks;
		}

		return [5, 4, 3, 2, 1];
	}

	playRandomGame() {
		const { board, player1, player2 } = this.randomPoker.dealHand();
		return this.compareHands(board, player1, player2);
	}
}
