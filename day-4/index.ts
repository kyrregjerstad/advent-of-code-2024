const file = Bun.file('day-4/data.txt');
const text = await file.text();

const grid = text
  .trim()
  .split('\n')
  .map((line) => line.split(''));

type Position = { x: number; y: number };
type Direction = { dx: number; dy: number };
type GridDimensions = { width: number; height: number };

const patterns = {
  X: 'XMAS',
  S: 'SAMX',
} as const;

const directions: Direction[] = [
  { dx: 1, dy: 0 }, // right
  { dx: 0, dy: 1 }, // down
  { dx: 1, dy: 1 }, // diagonal down-right
  { dx: -1, dy: 1 }, // diagonal down-left
];

function isInBounds({ x, y }: Position, { width, height }: GridDimensions) {
  return x >= 0 && x < width && y >= 0 && y < height;
}

function getEndPosition(start: Position, direction: Direction) {
  return {
    x: start.x + direction.dx * 3,
    y: start.y + direction.dy * 3,
  };
}

function getWordPositions(start: Position, direction: Direction): Position[] {
  return Array.from({ length: 4 }, (_, i) => ({
    x: start.x + direction.dx * i,
    y: start.y + direction.dy * i,
  }));
}

const getCharAtPosition = (grid: string[][], { x, y }: Position) => grid[y][x];

function getWordFromPositions(grid: string[][], positions: Position[]) {
  return positions.map((pos) => getCharAtPosition(grid, pos)).join('');
}

function getAllGridPositions({ width, height }: GridDimensions) {
  return Array.from({ length: height }, (_, y) =>
    Array.from({ length: width }, (_, x) => ({ x, y }))
  ).flat();
}

const countXMAS = (grid: string[][]) => {
  const dimensions = {
    height: grid.length,
    width: grid[0].length,
  };

  return getAllGridPositions(dimensions)
    .flatMap((startPos) => {
      const startChar = getCharAtPosition(grid, startPos);
      if (!(startChar in patterns)) return [];

      return directions
        .filter((dir) => {
          const endPos = getEndPosition(startPos, dir);
          return isInBounds(endPos, dimensions);
        })
        .map((dir) => {
          const positions = getWordPositions(startPos, dir);
          const word = getWordFromPositions(grid, positions);
          return word === patterns[startChar as keyof typeof patterns] ? 1 : 0;
        });
    })
    .reduce((sum: number, count) => sum + count, 0);
};

// 2458
console.log('result', countXMAS(grid));
