const fs = require("fs");
const path = require("path");

// Get the folder name from the command line
const folderName = process.argv[2];

if (!folderName) {
  console.error("Please provide a folder name.");
  process.exit(1);
}

const templatePath = path.join(__dirname, "template-files");
const destinationPath = path.join(process.cwd(), folderName);

// Create the folder if it doesn't exist
if (!fs.existsSync(destinationPath)) {
  fs.mkdirSync(destinationPath);
  console.log(`Created folder: ${destinationPath}`);
} else {
  console.error(
    `The folder "${folderName}" already exists. Please choose a different name.`
  );
  process.exit(1);
}

// Copy files to the new folder
fs.readdirSync(templatePath).forEach((file) => {
  const sourceFile = path.join(templatePath, file);
  const destFile = path.join(destinationPath, file);

  if (fs.statSync(sourceFile).isDirectory()) {
    // If the item is a directory, copy recursively
    copyFolderRecursiveSync(sourceFile, destFile);
  } else {
    // If the item is a file, copy it
    fs.copyFileSync(sourceFile, destFile);
    console.log(`Copied ${file} to ${destinationPath}`);
  }
});

console.log("Installation complete!");

// Function to copy folders recursively
function copyFolderRecursiveSync(source, target) {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target);
  }

  fs.readdirSync(source).forEach((file) => {
    const sourceFile = path.join(source, file);
    const targetFile = path.join(target, file);

    if (fs.statSync(sourceFile).isDirectory()) {
      // Recursively copy subdirectories
      copyFolderRecursiveSync(sourceFile, targetFile);
    } else {
      // Copy files
      fs.copyFileSync(sourceFile, targetFile);
      console.log(`Copied ${file} to ${destinationPath}`);
    }
  });
}
