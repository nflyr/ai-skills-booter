# Install skills implementation instructions

## Objective

Build a cross-platform installer that downloads the repository's `skills` and `agents` content into a target repository, applies the selected agent manager configuration, and writes the agent manager's `AGENTS.md` file into the target repo.

## Scope and facts from the repo

- Repository root contains:
  - `skills/`
  - `agents/`
  - `scripts/`
  - `docs/`
  - `agents/model-setup.json`
- The current `model-setup.json` contains:
  - `agentManagers.copilot.root = ".github"`
  - `agentManagers.devin.root = ".devin"`
  - `agentManagers.*.skills = "all"` or a list
  - `agentManagers.*.omit = [...]`
- The requirement document states that the installer must support:
  - a JavaScript implementation
  - a Bash wrapper for Linux
  - a CMD wrapper for Windows
  - a default operation against the current repo when run inside it
  - optional override to a target repo path

## Design decisions to lock in

### 1) Script naming and placement

- Place the implementation entrypoint at `scripts/install-skills.js`.
- Create wrappers:
  - `scripts/install-skills` for Linux/macOS Bash
  - `scripts/install-skills.cmd` for Windows CMD
- Keep the wrappers as thin launchers that call Node with the JS entrypoint.

### 2) Invocation contract

Recommended CLI:

```bash
install-skills <agent_manager>
install-skills <agent_manager> --repo /path/to/repo
install-skills <agent_manager> --help
```

Rules:

- Argument `agent_manager` is required. If missing, print a clear error to stderr and exit with code 1.
- If `--repo` is omitted, use the current working directory as the target repository.
- If `--repo` is provided, resolve it to an absolute path and use it as the target repository.

### 3) Validation and confirmation flow

Before performing any write operation:

- Verify `git` is available in `PATH`.
- If not, print an error and exit with code 1.
- Ask for confirmation using a safe interactive prompt such as `Proceed with installation? [y/N]`.
- If the user declines, exit with code 0 without making changes.
- If the user confirms, continue.

### 4) Repository source and temp download behavior

The install process must operate from a temporary folder in the system temp directory.

Implementation strategy:

- Create a temp directory with `fs.mkdtempSync(path.join(os.tmpdir(), 'install-skills-'))`.
- Download the repository contents needed for installation:
  - the full `skills` directory
  - the full `agents` directory
  - The file named `scripts/install-skills.js`. Don't worry if it does not exist when you are reading this, it will be created by the implementation agent.
- Because the script is meant to be used by copying or downloading a small bootstrap script, the source repo is NOT cloned locally. The script should therefore fetch the required contents of the repo archive from GitHub.
- Once downloaded, resolve the source paths:
  - `<temp>/skills`
  - `<temp>/agents`

### 5) Agent manager lookup

The script must load `<temp>/agents/model-setup.json` from the downloaded repo.

Pseudo-logic:

```js
const config = JSON.parse(fs.readFileSync(modelSetupPath, "utf8"));
const managers = config.agentManagers || {};
const manager = managers[agentManager];
if (!manager) {
  throw new Error(`No configuration found for agent manager: ${agentManager}`);
}
```

### 6) Mapping of fields

From the selected manager, read:

- `root`, default to `.agents`
- `skills`, default to `"all"`
- `omit`, default to `[]`

Canonical mapping rules:

```js
const installRoot = manager.root || ".agents";
const installSkills = manager.skills || "all";
const installOmit = manager.omit || [];
```

### 7) Skill selection rules

When copying the `skills` directory into the repo:

- If `installSkills === 'all'`, copy all skill directories and files under `skills/`.
- If it is an array, copy only the listed skill names.
- If it is a string that is not `all`, treat it as a single skill name and copy only that skill.

Folder filtering:

- Skip any path whose basename matches an entry in `installOmit` when that entry ends with `/`.
- For example, omit `agents/` or `docs/` by removing the full subtree.
- Skip matching file names when the omit entry does NOT end with `/`.
- Example: `CLAUDE.md` should be omitted only if that exact file path is encountered.

### 8) Target root creation

- Create `<targetRepo>/<installRoot>` if it does not already exist.
- Copy the selected `skills` contents into that directory.
- Preserve directory structure and files.
- Skip everything in the omit list.

### 9) Agent manager instruction file handling

- Resolve the source agent file:
  - `<temp>/agents/<agent_manager>/AGENTS.md`
- Resolve the destination file:
  - `<targetRepo>/AGENTS.md`
- If the destination file does not exist, write the source file as-is.
- If it exists, append the new file content with a separator inserted between them.

Recommended separator:

```text

---

```

Use a clear, deterministic boundary so both files remain readable.

## Implementation plan for the agent

### Step 1: create the Node entrypoint

Create `scripts/install-skills.js` with the following responsibilities:

1. Parse CLI args.
2. Validate `agent_manager` argument.
3. Resolve the target repo directory.
4. Check for `git` in `PATH`.
5. Prompt for confirmation.
6. Create temp directory.
7. Download repository content needed for the install.
8. Read `agents/model-setup.json` and locate the manager configuration.
9. Determine `root`, `skills`, and `omit` entries.
10. Create the install root directory in the target repo.
11. Copy approved skill content while respecting omit rules.
12. Merge or write `AGENTS.md` into the repo root.
13. Exit with success or error codes.

### Step 2: implement the core helper functions

Create helper functions for:

- `requireGit()`
- `promptConfirm()`
- `resolveRepoPath(args)`
- `downloadArchiveOrRepoContents(tempDir)`
- `loadModelSetup(modelSetupPath)`
- `getManagerConfig(config, agentManager)`
- `normalizeSelection(rawSelection)`
- `shouldOmit(relativePath, omitList)`
- `copySkills(sourceSkillsDir, targetRootDir, selectedSkills, omitList)`
- `mergeAgentsFile(sourceFile, destinationFile)`
- `main()`

### Step 3: implement file-copy logic carefully

The copy logic must preserve a clean repository layout.

Pseudo-logic:

```js
const selectedSkillNames = normalizeSelection(installSkills);
for (const entry of fs.readdirSync(sourceSkillsDir, { withFileTypes: true })) {
  const name = entry.name;
  if (selectedSkillNames !== "all" && !selectedSkillNames.includes(name)) continue;
  if (shouldOmit(name, omitList)) continue;

  const src = path.join(sourceSkillsDir, name);
  const dst = path.join(targetInstallRoot, name);
  copyDirOrFile(src, dst);
}
```

For omit rules, check both the immediate path and nested descendants.

### Step 4: implement the Bash and CMD wrappers

#### Bash wrapper

- `#!/usr/bin/env bash`
- Resolve the script directory.
- Call Node:

```bash
node "$SCRIPT_DIR/install-skills.js" "$@"
```

- Set executable permission on the wrapper.

#### CMD wrapper

```cmd
@echo off
setlocal
set "SCRIPT_DIR=%~dp0"
node "%SCRIPT_DIR%install-skills.js" %*
```

### Step 5: add validation and smoke tests

Before declaring completion, verify all of the following with a real local repo:

1. Running without an argument fails with code 1.
2. Running with a missing `git` in PATH fails with code 1.
3. Declining the confirmation exits with code 0 and makes no changes.
4. Installing for a valid manager creates the configured root directory.
5. Installed skills match the selection rules.
6. Omitted files and folders are not copied.
7. `AGENTS.md` is created or merged correctly.
8. The Bash wrapper works on Linux.
9. The CMD wrapper works on Windows if available in CI or WSL.

## Acceptance checklist

The implementation is complete only if all of the following are true:

- [ ] `scripts/install-skills.js` exists.
- [ ] `scripts/install-skills` exists and is executable.
- [ ] `scripts/install-skills.cmd` exists.
- [ ] No argument exits with non-zero status and prints a helpful error.
- [ ] Missing `git` exits with non-zero status and prints a helpful error.
- [ ] User confirmation is required before writing files.
- [ ] The script creates the install root directory under the target repo.
- [ ] It copies only the selected skills or all skills as configured.
- [ ] It respects omit rules for files and folders.
- [ ] It writes or appends `AGENTS.md` with a clear separator.
- [ ] It supports the repo's actual `agentManagers` schema.
- [ ] It can operate against the current repo or an explicit target path.

## Recommended final behavior

The safest production behavior is:

- default target repo = current working directory
- optional `--repo` override
- interactive confirmation before destructive changes
- strict validation of manager names
- immutable source handling in a temp directory
- idempotent, readable `AGENTS.md` merging

## Notes for the implementation agent

Do not invent a different configuration format. Use the repository's actual `agentManagers` structure and support both the requirement language and the actual JSON currently in the repo. The repo is the source of truth, and the installer should behave in the same way a user expects when they run it inside their own project.

