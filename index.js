const express = require("express");
const { exec } = require("child_process");
const cron = require("node-cron");

const app = express();
const PORT = 3000;

app.get("/commit", (req, res) => {
  commitToGit();
  res.send("Commit process initiated!");
});

// Schedule the daily commit
cron.schedule("0 0 * * *", () => {
  commitToGit();
});

function commitToGit() {
  exec(
    'git add . && git commit -m "Daily automated test one" && git push origin main',
    (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing git commands: ${error}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
    }
  );
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
