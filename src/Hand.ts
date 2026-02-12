import type { BoardHand, Deck, PlayerHand } from "./Deck";

enum HandCategories {
  BestCard = 0,
  OnePair = 1,
  TwoPair = 2,
  ThreeOfAKind = 3,
  Straight = 4,
  Flush = 5,
  FullHouse = 6,
  FourOfAKind = 7,
  StraightFlush = 8,
}

interface HandInterface {
  checkBestPlayerHand: (boardHand: BoardHand, playerHand: PlayerHand) => Deck;
}

export class HandClass implements HandInterface {
  checkBestPlayerHand(boardHand: BoardHand, playerHand: PlayerHand) {
    return boardHand;
  }

  isFourOfAKind(boardHand: BoardHand, playerHand: PlayerHand) {
    if (boardHand.length !== 4) {
      return true;
    }
  }

  areHandValid(boardHand: BoardHand, playerHand: PlayerHand): boolean {
    if (
      this.isBoardHandValid(boardHand) &&
      this.isPlayerHandValid(playerHand)
    ) {
      return true;
    }

    throw new Error("Hand are invalid");
  }

  isBoardHandValid(boardHand: BoardHand): boolean {
    return boardHand.length === 5;
  }

  isPlayerHandValid(playerHand: PlayerHand): boolean {
    return playerHand.length === 2;
  }
}
