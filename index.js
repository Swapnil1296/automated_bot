const express = require("express");
const { exec } = require("child_process");
const cron = require("node-cron");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;
const repoDir = "C:\\Users\\Swapnil_Landage\\Desktop\\automated_bot";
let count = 3;

app.get("/commit", (req, res) => {
  commitToGit();
  res.send("Commit process initiated!");
});

// Schedule the commit every 2 minutes
cron.schedule("*/1 * * * *", () => {
  console.log("in the schedule");
  commitToGit();
  count++;
});

// Replace "automated_bot" with your Git repository directory name

function commitToGit() {
  // Check if repoDir exists and is a directory
  console.log("Check if repoDir exists and is a directory");
  if (!fs.existsSync(repoDir) || !fs.statSync(repoDir).isDirectory()) {
    console.error(`Directory ${repoDir} does not exist or is not a directory.`);
    return;
  }

  // Check if repoDir is a Git repository
  if (!fs.existsSync(path.join(repoDir, ".git"))) {
    console.error(`Directory ${repoDir} is not a Git repository.`);
    return;
  }

  // Navigate to the Git repository directory
  process.chdir(repoDir);

  // Execute git commands sequentially using promises
  console.log("Execute git commands sequentially using promises");
  execPromise("git add .")
    .then(() => execPromise(`git commit -m "Daily automated test ${count}"`))
    .then(() => execPromise("git push origin main"))
    .then(() => {
      console.log(`Commit ${count} successful`);
    })
    .catch((error) => {
      console.error(`Error executing git commands: ${error}`);
    });
}
function execPromise(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
      resolve();
    });
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
