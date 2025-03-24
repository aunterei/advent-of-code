import run from "aocrunner";

const cards = ["2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"];
const cards2 = [
  "J",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "T",
  "Q",
  "K",
  "A",
];
interface Hand {
  hand: string;
  bid: number;
}

const getKeyByValue = <T, U>(map: Map<T, U>, value: U) => {
  const foundValue = [...map].find(([key, val]) => val == value);
  return !!foundValue ? foundValue[0] : undefined;
};

const getKeyOfMaxCardValue = <T>(map: Map<T, number>) => {
  const foundValue = [...map].reduce((prev, [key, val]) => {
    return map.get(prev) > val ? prev : key;
  }, [...map.keys()][0]);
  return !!foundValue ? foundValue[0] : undefined;
};
const getHandMap = (hand: string, part2 = false): Map<string, number> => {
  const handMap: Map<string, number> = new Map();

  const jokers = [];

  for (const char of hand) {
    if (part2 && char === "J") {
      jokers.push(char);
    } else {
      if (handMap.get(char)) {
        handMap.set(char, handMap.get(char) + 1);
      } else {
        handMap.set(char, 1);
      }
    }
  }

  if (part2) {
    const key = getKeyOfMaxCardValue(handMap);

    if (!key) {
      handMap.set("J", 5);
    } else {
      handMap.set(key, handMap.get(key) + jokers.length);
    }
  }
  if (hand === "AAAAJ") console.log(`${hand} HAND MAP !!! ${[...handMap]}`);

  return handMap;
};

const getHandValueSum = (hand: Map<string, number>): number => {
  return [...hand.keys()].reduce((prev, cur) => prev + cards.indexOf(cur), 0);
};

const compareFiveOfAKind = (
  leftHandCard: string,
  rightHandCard: string,
  part2 = false,
): -1 | 1 => {
  const deck = part2 ? cards2 : cards;
  console.log(
    `five of a kind: ${leftHandCard} ${rightHandCard} ${
      deck.indexOf(leftHandCard) > deck.indexOf(rightHandCard) ? -1 : 1
    }`,
  );
  return deck.indexOf(leftHandCard) > deck.indexOf(rightHandCard) ? -1 : 1;
};

const compareSideBySide = (
  leftHandCard: string,
  rightHandCard: string,
  part2 = false,
): -1 | 1 => {
  const deck = part2 ? cards2 : cards;
  for (let i = 0; i < 5; i++) {
    if (leftHandCard[i] === rightHandCard[i]) continue;
    return deck.indexOf(leftHandCard[i]) > deck.indexOf(rightHandCard[i])
      ? -1
      : 1;
  }
};
const compareFourOrFullHouse = (
  leftHandMap: Map<string, number>,
  rightHandMap: Map<string, number>,
  leftHand: string,
  rightHand: string,
  part2 = false,
): -1 | 1 => {
  const leftHasFourCard: boolean = !!getKeyByValue(leftHandMap, 4);
  const rightHasFourCard: boolean = !!getKeyByValue(rightHandMap, 4);

  if (leftHasFourCard !== rightHasFourCard) return leftHasFourCard ? -1 : 1;

  return compareSideBySide(leftHand, rightHand, part2);
};

const compareThreeOrTwoPair = (
  leftHandMap: Map<string, number>,
  rightHandMap: Map<string, number>,
  leftHand: string,
  rightHand: string,
  part2 = false,
): -1 | 1 => {
  const leftHasThreeCard: boolean = !!getKeyByValue(leftHandMap, 3);
  const rightHasThreeCard: boolean = !!getKeyByValue(rightHandMap, 3);
  if (leftHasThreeCard !== rightHasThreeCard) return leftHasThreeCard ? -1 : 1;

  return compareSideBySide(leftHand, rightHand, part2);
};

const comparePair = (
  leftHand: string,
  rightHand: string,
  part2 = false,
): -1 | 1 => {
  return compareSideBySide(leftHand, rightHand, part2);
};

const handSortingFn = (a: Hand, b: Hand, part2 = false): number => {
  const leftHandMap: Map<string, number> = getHandMap(a.hand, part2);
  const rightHandMap: Map<string, number> = getHandMap(b.hand, part2);

  if (leftHandMap.size !== rightHandMap.size) {
    return leftHandMap.size < rightHandMap.size ? -1 : 1;
  }

  if (leftHandMap.size === 1) {
    return compareSideBySide(a.hand, b.hand, part2);
  }

  if (leftHandMap.size === 2)
    return compareFourOrFullHouse(
      leftHandMap,
      rightHandMap,
      a.hand,
      b.hand,
      part2,
    );

  if (leftHandMap.size === 3)
    return compareThreeOrTwoPair(
      leftHandMap,
      rightHandMap,
      a.hand,
      b.hand,
      part2,
    );

  if (leftHandMap.size === 40) return comparePair(a.hand, b.hand, part2);

  return compareSideBySide(a.hand, b.hand, part2);
};

const parseInput = (rawInput: string) =>
  rawInput
    .replace(/\r\n/g, "\n")
    .replace(/\n*$/g, "")
    .split("\n")
    .map((line): Hand => {
      const splitedLine = line.split(" ");
      return {
        hand: splitedLine[0],
        bid: parseInt(splitedLine[1]),
      };
    });

const part1 = (rawInput: string) => {
  // const lines: Hand[] = parseInput(rawInput);
  //
  // return lines.sort(handSortingFn).reduce((prev, cur, index) => {
  //   return prev + cur.bid * (lines.length - index);
  // }, 0);
};

const part2 = (rawInput: string) => {
  const lines: Hand[] = parseInput(rawInput);

  console.log(lines.sort((a, b) => handSortingFn(a, b, true)));
  return lines.reduce((prev, cur, index) => {
    return prev + cur.bid * (lines.length - index);
  }, 0);
};

run({
  part1: {
    tests: [
      {
        input: `2345A 1
Q2KJJ 13
Q2Q2Q 19
T3T3J 17
T3Q33 11
2345J 3
J345A 2
32T3K 5
T55J5 29
KK677 7
KTJJT 34
QQQJA 31
JJJJJ 37
JAAAA 43
AAAAJ 59
AAAAA 61
2AAAA 23
2JJJJ 53
JJJJ2 41`,
        expected: 6592,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `2345A 1
Q2KJJ 13
Q2Q2Q 19
T3T3J 17
T3Q33 11
2345J 3
J345A 2
32T3K 5
T55J5 29
KK677 7
KTJJT 34
QQQJA 31
JJJJJ 37
JAAAA 43
AAAAJ 59
AAAAA 61
2AAAA 23
2JJJJ 53
JJJJ2 41`,
        expected: 6839,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
