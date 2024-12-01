// https://adventofcode.com/2024/day/1
import { list1, list2 } from './data';

const sortedList1 = list1.toSorted();
const sortedList2 = list2.toSorted();

const totalDiff = sortedList1.reduce((prev, current, i) => {
  const diff = Math.abs(current - sortedList2[i]);
  return prev + diff;
}, 0);

console.log('Answer #1', totalDiff);

const occurrencesMap = list2.reduce((prev, current) => {
  const occurrences = prev.get(current) ?? 0;
  prev.set(current, occurrences + 1);
  return prev;
}, new Map<number, number>());

const similarityScore = list1.reduce((acc, current) => {
  const occurrences = occurrencesMap.get(current) ?? 0;
  const score = current * occurrences;
  return acc + score;
}, 0);

console.log('Answer #2', similarityScore);
