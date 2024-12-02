const file = Bun.file('day-2/data.txt');
const text = await file.text();

const data = text
  .trim()
  .split('\n')
  .map((line) => line.trim().split(/\s+/).map(Number));

function isMonotonic(report: number[]): boolean {
  const isIncreasing = report[1] > report[0];

  for (let i = 1; i < report.length; i++) {
    const diff = report[i] - report[i - 1];
    if (Math.abs(diff) > 3 || diff === 0 || isIncreasing !== diff > 0) return false;
  }

  return true;
}

console.log('result', data.filter(isMonotonic).length);
