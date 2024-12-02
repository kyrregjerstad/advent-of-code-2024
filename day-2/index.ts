/* https://adventofcode.com/2024/day/2 */
const file = Bun.file('day-2/data.txt');
const text = await file.text();

const data = text
  .trim()
  .split('\n')
  .map((line) => line.trim().split(/\s+/).map(Number));

const isValidDifference = (diff: number) => Math.abs(diff) <= 3 && diff !== 0;

const maintainsDirection = (diff: number, isIncreasing: boolean) =>
  isIncreasing === diff > 0;

function isValidSequence(report: number[]) {
  const isIncreasing = report[1] > report[0];

  for (let i = 1; i < report.length; i++) {
    const diff = report[i] - report[i - 1];
    if (!isValidDifference(diff) || !maintainsDirection(diff, isIncreasing)) {
      return false;
    }
  }
  return true;
}

function isValidWithProblemDampener(report: number[]) {
  if (isValidSequence(report)) return true;

  return report.some((_, skipIndex) =>
    isValidSequence([...report.slice(0, skipIndex), ...report.slice(skipIndex + 1)])
  );
}

const safeReports = data.filter(isValidWithProblemDampener).length;

console.log('result', safeReports);
