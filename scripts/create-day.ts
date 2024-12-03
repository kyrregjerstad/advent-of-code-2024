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
const file = Bun.file('${dayFolder}/data.txt');
const text = await file.text();

`;

    await mkdir(dayFolder);

    await writeFile(join(dayFolder, 'index.ts'), indexTemplate);

    console.log(`Created template for day ${nextDay}`);
  } catch (error) {
    console.error('Error creating day template:', error);
  }
}

createDay();
