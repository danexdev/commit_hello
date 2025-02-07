# GitHub Contribution Art: "HELLO"

This project generates a custom pattern on your **GitHub contribution graph** (green squares) by making commits on specific dates.

## 📌 How It Works

- The script **strategically commits** on certain dates to spell out the word **"HELLO"** on your GitHub profile.
- Uses a **Node.js script** to automate the process.
- Works by **modifying commit timestamps**.
- After pushing the commits, your GitHub **contribution graph** will display "HELLO" in green squares.

---

## 🚀 Getting Started

### 1️⃣ Prerequisites

Before running the script, make sure you have:

- **GitHub account**
- **A new empty GitHub repository**
- **Node.js installed** (`v14+`)
- **Git installed**

### 2️⃣ Clone Your Repository

```bash
git clone git@github.com:your-username/your-repo.git
cd your-repo
```

### 3️⃣ Run the Script

1. Save the script as `commit_hello.js` inside the repo.
2. Run the script using Node.js:

```bash
node commit_hello.js
```

---

## 📊 Viewing Your Contribution Graph

- **Check your GitHub profile** within a few minutes.
- The **"HELLO" pattern** should appear as green squares!
- If not, ensure your repository is **public** (GitHub counts only public commits by default).

---

## 🔄 Customization

- Modify the **GRID** variable inside `commit_hello.js` to create **different words or patterns**.
- Change the **starting date** (`START_DATE`) to adjust placement on the grid.

---

## 🛑 Important Notes

- Your repository should be **public** to reflect contributions on your GitHub graph.
- GitHub contribution updates **may take a few minutes**.
- You can delete the repository later to remove the commits from your profile.

---

## 🤔 Why Did I Do This?

Recruiters often place excessive importance on GitHub contribution graphs, assuming they fully reflect a developer’s experience. However, many real-world projects live in **Bitbucket, GitLab, or private company repositories**, making this metric a poor indicator of actual skills. To highlight this flaw, this project artificially fills up the GitHub contribution graph with a simple message—because sometimes, perception matters more than reality.

---

## 🤩 Enjoy Your Custom GitHub Art!

Create fun commit patterns and impress others with your unique GitHub profile design!
