import { DeckGenerator } from "./Deck";
import type { Card, Deck } from "./Deck";

interface RandomPokerInterface {
  shuffleDeck: (deck: Deck) => Deck;
  dealHand: () => Hands;
}

export type Hands = {
  board: Deck;
  player1: Deck;
  player2: Deck;
};

export class RandomPoker implements RandomPokerInterface {
  shuffleDeck = (deck: Deck): Deck => {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      const currentItem: Card | undefined = shuffled[i];
      const targetItem: Card | undefined = shuffled[j];

      if (currentItem && targetItem) {
        shuffled[i] = targetItem;
        shuffled[j] = currentItem;
      }
    }
    return shuffled;
  };

  dealHand = () => {
    const generator = new DeckGenerator();
    const fullDeck = generator.generateDeck();
    const shuffled = this.shuffleDeck(fullDeck);

    return {
      board: shuffled.slice(0, 5),
      player1: shuffled.slice(5, 7),
      player2: shuffled.slice(7, 9),
    };
  };
}

