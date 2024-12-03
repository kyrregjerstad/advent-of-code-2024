/* https://adventofcode.com/2024/day/3 */
const file = Bun.file('day-3/data.txt');
const text = await file.text();

const mulRegexWithGroups = /mul\((\d+),(\d+)\)/g;
const chunkRegex = /(?:^|do\(\))([^]*?)(?=don't\(\)|$)/g;

const matches = Array.from(text.matchAll(mulRegexWithGroups));
const numberPairs = matches.map((match) => [Number(match[1]), Number(match[2])]);

const multiply = (acc: number, [a, b]: number[]) => a * b + acc;

const answer1 = numberPairs.reduce(multiply, 0);

console.log('answer 1', answer1);

const extractMultiplications = (acc: number[][], chunk: string) => [
  ...acc,
  ...Array.from(chunk.matchAll(mulRegexWithGroups)).map(([_, num1, num2]) => [
    Number(num1),
    Number(num2),
  ]),
];

const answer2 = Array.from(text.matchAll(chunkRegex))
  .map((match) => match[1])
  .reduce(extractMultiplications, [])
  .reduce(multiply, 0);

console.log('answer 2', answer2);
