const file = Bun.file('day-4/data.txt');
const text = await file.text();
const grid = text
  .trim()
  .split('\n')
  .map((line) => line.split(''));

type Position = { x: number; y: number };
type Direction = { dx: number; dy: number };
type GridDimensions = { width: number; height: number };
type Grid = string[][];

const createGridDimensions = (grid: Grid): GridDimensions => ({
  height: grid.length,
  width: grid[0].length,
});

const isInBounds = ({ x, y }: Position, { width, height }: GridDimensions) =>
  x >= 0 && x < width && y >= 0 && y < height;

const getCharAtPosition = (grid: Grid, { x, y }: Position) => grid[y][x];

const getAllGridPositions = ({ width, height }: GridDimensions): Position[] =>
  Array.from({ length: height }, (_, y) =>
    Array.from({ length: width }, (_, x) => ({ x, y }))
  ).flat();

const getWordFromPositions = (grid: Grid, positions: Position[]): string =>
  positions.map((pos) => getCharAtPosition(grid, pos)).join('');

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

const getEndPosition = (start: Position, direction: Direction): Position => ({
  x: start.x + direction.dx * 3,
  y: start.y + direction.dy * 3,
});

const getWordPositions = (start: Position, direction: Direction): Position[] =>
  Array.from({ length: 4 }, (_, i) => ({
    x: start.x + direction.dx * i,
    y: start.y + direction.dy * i,
  }));

const findWordsFromPosition =
  (grid: Grid, dimensions: GridDimensions) =>
  (startPos: Position): number => {
    const startChar = getCharAtPosition(grid, startPos);
    if (!(startChar in patterns)) return 0;

    return directions
      .filter((dir) => isInBounds(getEndPosition(startPos, dir), dimensions))
      .map((dir) => {
        const word = getWordFromPositions(grid, getWordPositions(startPos, dir));
        return word === patterns[startChar as keyof typeof patterns] ? 1 : 0;
      })
      .reduce((sum: number, count) => sum + count, 0);
  };

const countXMAS = (grid: Grid): number => {
  const dimensions = createGridDimensions(grid);
  return getAllGridPositions(dimensions)
    .map(findWordsFromPosition(grid, dimensions))
    .reduce((sum, count) => sum + count, 0);
};

const isMAS = (word: string): boolean => word === 'MAS' || word === 'SAM';

const getXShapePositions = (center: Position): Position[][] => [
  [{ x: center.x - 1, y: center.y - 1 }, center, { x: center.x + 1, y: center.y + 1 }],
  [{ x: center.x + 1, y: center.y - 1 }, center, { x: center.x - 1, y: center.y + 1 }],
]; // 🫠;

const isValidXPattern =
  (grid: Grid, dimensions: GridDimensions) =>
  (center: Position): boolean => {
    if (getCharAtPosition(grid, center) !== 'A') return false;

    const [diagonal1, diagonal2] = getXShapePositions(center);

    const isValid =
      diagonal1.every((pos) => isInBounds(pos, dimensions)) &&
      diagonal2.every((pos) => isInBounds(pos, dimensions));

    if (!isValid) return false;

    return (
      isMAS(getWordFromPositions(grid, diagonal1)) &&
      isMAS(getWordFromPositions(grid, diagonal2))
    );
  };

const countXMASPart2 = (grid: Grid): number => {
  const dimensions = createGridDimensions(grid);
  return getAllGridPositions(dimensions).filter(isValidXPattern(grid, dimensions)).length;
};

console.log('Part 1 result:', countXMAS(grid)); // 2458
console.log('Part 2 result:', countXMASPart2(grid)); // 1945
