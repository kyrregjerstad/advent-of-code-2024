const dayArg = process.argv[2];

if (!dayArg) {
  console.error('Please specify a day, e.g.: bun start day-1');
  process.exit(1);
}

try {
  await import(`../${dayArg}/index.ts`);
} catch (error) {
  console.error(`Error running ${dayArg}:`, error);
}
