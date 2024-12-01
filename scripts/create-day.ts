import { mkdir, writeFile, readdir } from 'fs/promises';
import { join } from 'path';

async function getNextDayNumber(): Promise<number> {
  const dirs = await readdir('.');
  const dayDirs = dirs
    .filter((dir) => dir.startsWith('day-'))
    .map((dir) => parseInt(dir.split('-')[1]));

  if (dayDirs.length === 0) return 1;
  return Math.max(...dayDirs) + 1;
}

async function createDay() {
  try {
    const nextDay = await getNextDayNumber();
    const dayFolder = `day-${nextDay}`;

    const indexTemplate = `
import { data } from './data';

console.log('Part 1:');
// Your solution here

console.log('Part 2:');
// Your solution here
`;

    const dataTemplate = `export const data = \`
// Paste your input data here
\`;`;

    // Create day directory
    await mkdir(dayFolder);

    // Create files
    await writeFile(join(dayFolder, 'index.ts'), indexTemplate);
    await writeFile(join(dayFolder, 'data.ts'), dataTemplate);

    console.log(`Created template for day ${nextDay}`);
  } catch (error) {
    console.error('Error creating day template:', error);
  }
}

createDay();
