import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import inquirer from "inquirer";
import chalk from "chalk";
import ora from "ora";
import boxen from "boxen";

// Define __dirname for ESModules in TypeScript
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Welcome message
console.log(
  boxen(chalk.bold.blue("🚀 Node Express TypeScript Template"), {
    padding: 1,
    margin: 1,
    borderStyle: "round",
    borderColor: "blue",
  })
);

// Function to get folder name interactively
async function getFolderName(): Promise<string> {
  const { folderName } = await inquirer.prompt([
    {
      type: "input",
      name: "folderName",
      message: chalk.cyan("What would you like to name your project?"),
      validate: (input: string) => {
        if (!input) {
          return chalk.red("Project name is required");
        }
        if (fs.existsSync(path.join(process.cwd(), input))) {
          return chalk.red(
            "This folder already exists. Please choose another name."
          );
        }
        return true;
      },
    },
  ]);
  return folderName;
}

// Main function
async function main() {
  try {
    const folderName = await getFolderName();
    const templatePath = path.join(__dirname, "template-files");
    const destinationPath = path.join(process.cwd(), folderName);

    // Create folder
    const spinner = ora(chalk.yellow("Creating project...")).start();
    fs.mkdirSync(destinationPath);
    spinner.succeed(chalk.green(`Folder created: ${folderName}`));

    // Copy files
    spinner.start(chalk.yellow("Copying files..."));
    await copyFolderRecursiveSync(templatePath, destinationPath);
    spinner.succeed(chalk.green("Files copied successfully"));

    // Final message
    console.log(
      boxen(
        chalk.green(`
✨ Project created successfully!

To get started:
  ${chalk.cyan(`cd ${folderName}`)}
  ${chalk.cyan("npm install")}
  ${chalk.cyan("npm run dev")}
        `),
        {
          padding: 1,
          margin: 1,
          borderStyle: "round",
          borderColor: "green",
        }
      )
    );
  } catch (error) {
    console.error(chalk.red("❌ Error:"), error);
    process.exit(1);
  }
}

// Function to copy folders recursively
async function copyFolderRecursiveSync(
  source: string,
  target: string
): Promise<void> {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target);
  }

  const files = fs.readdirSync(source);
  for (const file of files) {
    const sourceFile = path.join(source, file);
    const targetFile = path.join(target, file);

    if (fs.statSync(sourceFile).isDirectory()) {
      await copyFolderRecursiveSync(sourceFile, targetFile);
    } else {
      fs.copyFileSync(sourceFile, targetFile);
    }
  }
}

main();
