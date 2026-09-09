"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");
const readline = require("readline");
const { spawnSync } = require("child_process");

const REPOSITORY_URL = process.env.INSTALL_SKILLS_REPOSITORY || "https://github.com/nflyr/ai-skills-booter.git";

function parseArguments(args) {
  if (args.length === 1) return { target: path.resolve("."), manager: args[0] };
  if (args.length === 2) return { target: path.resolve(args[1]), manager: args[0] };
  throw new Error("Usage: install-skills <agent-manager> [target-repository]");
}

function runGit(args) {
  const result = spawnSync("git", args, { encoding: "utf8", stdio: "pipe" });
  if (result.error) throw new Error(`Unable to run git: ${result.error.message}`);
  if (result.status !== 0) throw new Error((result.stderr || result.stdout || "Git command failed").trim());
  return result.stdout;
}

function askConfirmation() {
  if (!process.stdin.isTTY) return Promise.resolve(false);
  const input = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) =>
    input.question("Proceed with installation? [y/N] ", (answer) => {
      input.close();
      resolve(/^(y|yes)$/i.test(answer.trim()));
    }),
  );
}

function readConfig(sourceRoot, manager) {
  const config = JSON.parse(fs.readFileSync(path.join(sourceRoot, "agents", "model-setup.json"), "utf8"));
  const entry = config.agentManagers && config.agentManagers[manager];
  if (!entry) throw new Error(`Unknown agent manager: ${manager}`);
  const root = entry.install_root || entry.root;
  const skills = entry.install_skills || entry.skills;
  const omit = entry.install_omit || entry.omit || [];
  if (typeof root !== "string" || !root || path.isAbsolute(root) || root.split(/[\\/]/).includes("..")) {
    throw new Error(`Invalid install root for ${manager}`);
  }
  if (skills !== "all" && (!Array.isArray(skills) || skills.some((name) => !validRelativeName(name)))) {
    throw new Error(`Invalid skills configuration for ${manager}`);
  }
  if (!Array.isArray(omit) || omit.some((name) => typeof name !== "string" || !validRelativeName(name.replace(/\/$/, "")))) {
    throw new Error(`Invalid omit configuration for ${manager}`);
  }
  return { root, skills, omit };
}

function validRelativeName(value) {
  return (
    typeof value === "string" &&
    value.length > 0 &&
    !path.isAbsolute(value) &&
    !value.split(/[\\/]/).includes("..") &&
    !value.includes("\0")
  );
}

function selectedSkills(sourceRoot, selection) {
  const available = fs
    .readdirSync(path.join(sourceRoot, "skills"), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
  const selected = selection === "all" ? available : selection;
  for (const skill of selected) {
    if (!available.includes(skill)) throw new Error(`Requested skill not found: ${skill}`);
  }
  return selected;
}

function omitPath(relativePath, rules) {
  const normalized = relativePath.split(path.sep).join("/");
  return rules.some((rule) => {
    const value = rule.replace(/\/$/, "");
    if (rule.endsWith("/"))
      return normalized === value || normalized.startsWith(`${value}/`) || normalized.split("/").includes(value);
    return normalized === value || path.posix.basename(normalized) === value;
  });
}

function copyTree(source, destination, omitRules = []) {
  fs.mkdirSync(destination, { recursive: true });
  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    const relative = entry.name;
    if (omitPath(relative, omitRules)) continue;
    const from = path.join(source, entry.name);
    const to = path.join(destination, entry.name);
    if (entry.isDirectory()) copyTree(from, to, omitRules);
    else if (entry.isFile()) fs.copyFileSync(from, to);
  }
}

function appendAgentsFile(targetFile, newContent) {
  const existing = fs.existsSync(targetFile) ? fs.readFileSync(targetFile, "utf8") : "";
  const content = existing ? `${existing}\n\n---\n\n${newContent}` : newContent;
  const temporary = `${targetFile}.${process.pid}.tmp`;
  fs.writeFileSync(temporary, content, "utf8");
  fs.renameSync(temporary, targetFile);
}

function install(sourceRoot, targetRoot, manager) {
  const config = readConfig(sourceRoot, manager);
  const skills = selectedSkills(sourceRoot, config.skills);
  const destination = path.join(targetRoot, config.root);
  for (const skill of skills) copyTree(path.join(sourceRoot, "skills", skill), path.join(destination, skill), config.omit);
  const agentFile = path.join(sourceRoot, "agents", manager, "AGENTS.md");
  if (!fs.existsSync(agentFile)) throw new Error(`Missing agent instructions: ${manager}/AGENTS.md`);
  appendAgentsFile(path.join(targetRoot, "AGENTS.md"), fs.readFileSync(agentFile, "utf8"));
}

async function main(args = process.argv.slice(2)) {
  const { target, manager } = parseArguments(args);
  if (!fs.existsSync(target) || !fs.statSync(target).isDirectory())
    throw new Error(`Target repository does not exist: ${target}`);
  try {
    runGit(["--version"]);
  } catch (error) {
    throw new Error("Git is not available on PATH.");
  }
  console.log(`Install ${manager} skills into ${target}?`);
  if (!(await askConfirmation())) {
    console.log("Installation cancelled.");
    return;
  }
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "install-skills-"));
  try {
    runGit(["clone", "--depth", "1", REPOSITORY_URL, temporary]);
    install(temporary, target, manager);
    console.log("Installation completed successfully.");
  } finally {
    fs.rmSync(temporary, { recursive: true, force: true });
  }
}

module.exports = {
  appendAgentsFile,
  copyTree,
  install,
  omitPath,
  parseArguments,
  readConfig,
  selectedSkills,
  validRelativeName,
};

if (require.main === module)
  main().catch((error) => {
    console.error(`Error: ${error.message}`);
    process.exitCode = 1;
  });
