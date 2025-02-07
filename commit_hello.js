const { execSync } = require("child_process");
const fs = require("fs");

// Your GitHub repository URL (replace with your own)
const GITHUB_REPO = "git@github.com:danexdev/commit_hello.git";

// Define commit message and file name
const MESSAGE = "Hello from GitHub Contribution Art!";
const FILE_NAME = "contributions.txt";

// Start date for "HELLO" (aligned cleanly)
const START_DATE = new Date("2025-04-07");

// "HELLO" pattern (7 rows)
const GRID = [
  "H   H  EEEEE  L      L       OOO  ",
  "H   H  E      L      L      O   O ",
  "HHHHH  EEEE   L      L      O   O ",
  "H   H  E      L      L      O   O ",
  "H   H  EEEEE  LLLLL  LLLLL   OOO  ",
];



function generateCommitDates(startDate, grid) {
  const commits = [];
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      if (grid[row][col] !== " ") {
        const commitDate = new Date(startDate);
        commitDate.setDate(commitDate.getDate() + col * 7 + row); // Align by column (weeks) and row (days)
        commits.push(commitDate.toISOString().split("T")[0]);
      }
    }
  }
  return [...new Set(commits)];
}

// Generate aligned commit dates
const commitDates = generateCommitDates(START_DATE, GRID);

// Initialize Git repo if not already initialized
if (!fs.existsSync(".git")) {
  execSync("git init");
  execSync(`git remote add origin ${GITHUB_REPO}`);
}

// Create and push commits
for (const date of commitDates) {
  fs.writeFileSync(FILE_NAME, MESSAGE + " " + date);
  execSync("git add .");
  execSync(`git commit --date="${date}" -m "${MESSAGE}"`);
}

// Push to GitHub
execSync("git branch -M main");
execSync(`git push -u origin main`);

console.log("✅ Perfectly aligned 'HELLO' added to your GitHub contributions!");