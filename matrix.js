require("dotenv").config();
const { execSync } = require("child_process");
const fs = require("fs");
const CHAR_MAP = require("./charMap");

const GITHUB_REPO = process.env.GITHUB_REPO;
const TEXT_TO_DISPLAY = process.env.TEXT_TO_DISPLAY;
const YEAR = parseInt(process.env.YEAR);
const FILL_BACKGROUND = process.env.FILL_BACKGROUND === "true";
const COMMIT_MESSAGE = process.env.COMMIT_MESSAGE;

const SUNDAY_NUMBER = 0;

// Helper: Get the first Sunday of the year
function getFirstSunday(year) {
  const date = new Date(`${year}-01-01`);
  while (date.getDay() !== SUNDAY_NUMBER) {
    date.setDate(date.getDate() + 1);
  }
  return date;
}

function generateCommitDates(year, text, fillBackground) {
  const firstSunday = getFirstSunday(year);
  const totalDaysInYear = Math.ceil((new Date(`${year}-12-31`) - firstSunday + 1) / (24 * 60 * 60 * 1000));
  const totalColumns = Math.ceil(totalDaysInYear / 7); // Weeks in the year
  const rows = 7; // Sunday-Saturday
  const maxLength = Math.floor(totalColumns / 6); // Fit 6 columns per character
  const truncatedText = text.slice(0, maxLength);

  // Use a Set to store unique dates
  const commitDatesSet = new Set();
  const matrixStartRow = 2; // Start rendering from the 2nd row (align text vertically)

  truncatedText.split("").forEach((char, charIndex) => {
    const charMap = CHAR_MAP[char] || CHAR_MAP[" "];
    const charStartCol = charIndex * 6; // 6 columns per character

    charMap.forEach((charRow, rowIndex) => {
      const row = rowIndex + matrixStartRow; // apply offset
      for (let colIndex = 0; colIndex < charRow.length; colIndex++) {
        const isPixelFilled = charRow[colIndex] === "#";
        const colPosition = charStartCol + colIndex;

        console.log(`Char: ${char}, row: ${row}, col: ${colPosition}, filled: ${isPixelFilled}`);

        if (isPixelFilled && colPosition <= totalColumns && row <= rows) {
          const commitDayOffset = colPosition * 7 + row + (colPosition >= 12 ? 1: 0); // Calculate exact day offset
          const commitDate = new Date(firstSunday);
          commitDate.setDate(firstSunday.getDate() + commitDayOffset);
          commitDatesSet.add(commitDate.toISOString().split("T")[0]);
        }
      }
    });
  });

  return [...commitDatesSet];
}

// Generate commit dates based on .env configuration
const commitDates = generateCommitDates(YEAR, TEXT_TO_DISPLAY, FILL_BACKGROUND);

// Initialize Git repo if not already initialized
if (!fs.existsSync(".git")) {
  execSync("git init");
  execSync(`git remote add origin ${GITHUB_REPO}`);
}

// Create and push commits
commitDates.forEach((date) => {
  fs.writeFileSync("contributions.txt", COMMIT_MESSAGE + " " + date);
  execSync("git add .");
  execSync(`git commit --date="${date}" -m "${COMMIT_MESSAGE}"`);
});

// Push to GitHub
execSync("git branch -M main");
execSync(`git push -u origin main`);

console.log("✅ Contribution art successfully generated!");
