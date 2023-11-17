const fs = require("fs");
const path = require("path");

const templatePath = path.join(__dirname, "template-files");
const destinationPath = process.cwd();

fs.readdirSync(templatePath).forEach((file) => {
  const sourceFile = path.join(templatePath, file);
  const destFile = path.join(destinationPath, file);

  fs.copyFileSync(sourceFile, destFile);
  console.log(`Copied ${file} to ${destinationPath}`);
});

console.log("Installation complete!");
