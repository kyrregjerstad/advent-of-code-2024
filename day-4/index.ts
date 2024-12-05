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

function isMAS(word: string): boolean {
  return word === 'MAS' || word === 'SAM';
}

function getXShapePositions(center: Position): Position[][] {
  return [
    // First diagonal (top-left to bottom-right)
    [
      { x: center.x - 1, y: center.y - 1 }, // M
      center, // A
      { x: center.x + 1, y: center.y + 1 }, // S
    ],
    // Second diagonal (top-right to bottom-left)
    [
      { x: center.x + 1, y: center.y - 1 }, // M
      center, // A
      { x: center.x - 1, y: center.y + 1 }, // S
    ],
  ];
}

const countXMASPart2 = (grid: string[][]) => {
  const dimensions = {
    height: grid.length,
    width: grid[0].length,
  };

  let count = 0;

  getAllGridPositions(dimensions).forEach((center) => {
    // Skip if the center position is not 'A'
    if (getCharAtPosition(grid, center) !== 'A') return;

    const [diagonal1, diagonal2] = getXShapePositions(center);

    if (
      !diagonal1.every((pos) => isInBounds(pos, dimensions)) ||
      !diagonal2.every((pos) => isInBounds(pos, dimensions))
    ) {
      return;
    }

    const word1 = getWordFromPositions(grid, diagonal1);
    const word2 = getWordFromPositions(grid, diagonal2);

    if (isMAS(word1) && isMAS(word2)) {
      count++;
    }
  });

  return count;
};

// Part 1 result: 2458
console.log('Part 1 result:', countXMAS(grid));

// Part 2 result: 1945
console.log('Part 2 result:', countXMASPart2(grid));
