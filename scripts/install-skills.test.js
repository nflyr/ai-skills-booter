"use strict";

const assert = require("assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { appendAgentsFile, copyTree, omitPath, parseArguments, readConfig } = require("./install-skills");

const root = fs.mkdtempSync(path.join(os.tmpdir(), "install-skills-test-"));
const source = path.join(root, "source");
const target = path.join(root, "target");
fs.mkdirSync(path.join(source, "agents", "copilot"), { recursive: true });
fs.mkdirSync(path.join(source, "skills", "demo", "agents"), { recursive: true });
fs.mkdirSync(target, { recursive: true });
fs.writeFileSync(
  path.join(source, "agents", "model-setup.json"),
  JSON.stringify({ agentManagers: { copilot: { root: ".github", skills: ["demo"], omit: ["agents/"] } } }),
);
fs.writeFileSync(path.join(source, "agents", "copilot", "AGENTS.md"), "new instructions");
fs.writeFileSync(path.join(source, "skills", "demo", "keep.md"), "keep");
fs.writeFileSync(path.join(source, "skills", "demo", "agents", "omit.md"), "omit");

assert.deepStrictEqual(parseArguments(["copilot"]).manager, "copilot");
assert.deepStrictEqual(parseArguments(["devin", "/tmp/repository"]), {
  manager: "devin",
  target: path.resolve("/tmp/repository"),
});
assert.throws(() => parseArguments([]), /Usage/);
assert.strictEqual(omitPath("agents/omit.md", ["agents/"]), true);
assert.strictEqual(omitPath("keep.md", ["agents/"]), false);
assert.deepStrictEqual(readConfig(source, "copilot").skills, ["demo"]);
copyTree(path.join(source, "skills", "demo"), path.join(target, ".github", "demo"), ["agents/"]);
assert.strictEqual(fs.existsSync(path.join(target, ".github", "demo", "agents", "omit.md")), false);
appendAgentsFile(path.join(target, "AGENTS.md"), "first");
appendAgentsFile(path.join(target, "AGENTS.md"), "second");
assert.match(fs.readFileSync(path.join(target, "AGENTS.md"), "utf8"), /first\n\n---\n\nsecond/);
fs.rmSync(root, { recursive: true, force: true });
console.log("install-skills tests passed");
