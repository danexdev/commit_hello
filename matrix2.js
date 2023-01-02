require('dotenv').config()
const { execSync } = require('child_process')
const fs = require('fs')
const CHAR_MAP = require('./charMap')

const GITHUB_REPO = process.env.GITHUB_REPO
const TEXT_TO_DISPLAY = process.env.TEXT_TO_DISPLAY
const YEAR = parseInt(process.env.YEAR)
const FILL_BACKGROUND = process.env.FILL_BACKGROUND === 'true'
const COMMIT_MESSAGE = process.env.COMMIT_MESSAGE

const SUNDAY_NUMBER = 0
const SATURDAY_NUMBER = 6

// Helper: Get the first Sunday of the year
function getFirstSunday(year) {
  const date = new Date(`${year}-01-01`)
  while (date.getDay() !== SUNDAY_NUMBER) {
    date.setDate(date.getDate() + 1)
  }
  return date
}

function getLastSaturday(year) {
  const date = new Date(`${year}-12-31`)
  while (date.getDay() !== SATURDAY_NUMBER) {
    date.setDate(date.getDate() - 1)
  }
  return date
}

function generateCommitDates(year, text, fillBackground) {
  // TODO: Add support for fillBackground
  const firstSunday = getFirstSunday(year)
  const lastSaturday = getLastSaturday(year)
  const totalColumns = Math.ceil(
    (lastSaturday - firstSunday + 1) / (7 * 24 * 60 * 60 * 1000)
  )
  const rows = 7 // Sunday-Saturday
  const maxLength = Math.floor(totalColumns / 6) // Fit 6 columns per character
  const truncatedText = text.slice(0, maxLength)

  const matrixStartRow = 1 // Start rendering from the 2nd row (align text vertically)

  const matrix = Array.from({ length: rows }, (_, rowIndex) =>
    Array.from({ length: totalColumns }, (_, colIndex) => {
      const date = new Date(firstSunday)
      // Calculate the correct date for each cell in the matrix
      date.setDate(firstSunday.getDate() + colIndex * 7 + rowIndex)
      return date
    })
  )

  const commitDates = []

  truncatedText.split('').forEach((char, charIndex) => {
    const charMap = CHAR_MAP[char] || CHAR_MAP[' ']
    const charStartCol = charIndex * 6 // 6 columns per character

    charMap.forEach((charRow, rowIndex) => {
      const row = rowIndex + matrixStartRow // Apply vertical offset for rendering
      for (let colIndex = 0; colIndex < charRow.length; colIndex++) {
        const isPixelFilled = charRow[colIndex] === '#'
        const colPosition = charStartCol + colIndex

        // Ensure we don't exceed matrix boundaries
        if (isPixelFilled && row < rows && colPosition < totalColumns) {
          const date = matrix[row][colPosition] // Get date from the matrix
          commitDates.push(date.toISOString().split('T')[0]) // Add date in YYYY-MM-DD format
        }
      }
    })
  })

  return commitDates.sort()
}

// Generate commit dates based on .env configuration
const commitDates = generateCommitDates(YEAR, TEXT_TO_DISPLAY, FILL_BACKGROUND)

// Initialize Git repo if not already initialized
if (!fs.existsSync('.git')) {
  execSync('git init')
  execSync(`git remote add origin ${GITHUB_REPO}`)
}

// Create and push commits
commitDates.forEach((date) => {
  fs.writeFileSync('contributions.txt', COMMIT_MESSAGE + ' ' + date)
  execSync('git add .')
  execSync(`git commit --date="${date}" -m "${COMMIT_MESSAGE}"`)
})

// Push to GitHub
execSync('git branch -M main')
execSync(`git push -u origin main`)

console.log('✅ Contribution art successfully generated!')
