import type { Hand } from "./Random";

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
  checkBestPlayerHand: (boardHand: Hand, playerHand: Hand) => Hand;
}

class HandClass implements HandInterface {
  checkBestPlayerHand(boardHand: Hand, playerHand: Hand) {
    return boardHand;
  }
}

