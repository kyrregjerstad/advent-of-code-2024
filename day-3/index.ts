/* https://adventofcode.com/2024/day/3 */
const file = Bun.file('day-3/data.txt');
const text = await file.text();

const mulRegexWithGroups = /mul\((\d+),(\d+)\)/g;
const chunkRegex = /(?:^|do\(\))([^]*?)(?=don't\(\)|$)/g;

const parseNumberPairs = (match: RegExpMatchArray) => [
  Number(match[1]),
  Number(match[2]),
];

const extractNumberPairs = (text: string) =>
  Array.from(text.matchAll(mulRegexWithGroups)).map(parseNumberPairs);

const multiply = (acc: number, [a, b]: number[]) => a * b + acc;

const answer1 = extractNumberPairs(text).reduce(multiply, 0);

const answer2 = Array.from(text.matchAll(chunkRegex))
  .map((match) => match[1])
  .flatMap(extractNumberPairs)
  .reduce(multiply, 0);

console.log('answer 1', answer1);
console.log('answer 2', answer2);
