# Job

Implement a portable installer based on downloading parts of this repository into the user's local system and place them in the appropriate locations.

The user MUST download and make available the scripts locally before running them.

## Design decisions to lock in

### 1) Script naming and placement

- Place the implementation entrypoint at `scripts/install-agents.js`.
- Create wrappers:
   - `scripts/install-agents` for Linux/macOS Bash
   - `scripts/install-agents.cmd` for Windows CMD
- Keep the wrappers as thin launchers that call Node with the JS entrypoint.

### 2) Invocation contract

Recommended CLI:

```bash
install-skills <for_agent>
install-skills <for_agent> --repo /path/to/repo
install-skills <for_agent> --help
```

Rules:

- Argument `for_agent` is required. If missing, print a clear error to stderr and exit with code 1.
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
   - the full `components` directory
   - The file `scripts/install-agents.js`.

?????????????????????????????????

- Once downloaded, resolve the source paths:
   - `<temp>/skills`
   - `<temp>/agents`

### 5) Agent manager lookup

The script must load `<temp>/models.json` into memory. Pseudo-logic:

```js
const models = JSON.parse(fs.readFileSync(modelSetupPath, "utf8"));
const agents = models.agents || {};
const selectedAgent = agents[forAgent];
if (!selectedAgent) {
   throw new Error(`No configuration found for agent: ${selectedAgent}`);
}
```

### 6) Mapping of resources

From the selected agent (var selectedAgent), read:

- `root`, default to `.agents`
- `skills.include`, default to `"*"`, otherwise should be an array of skill names.
- `skills.omit`, default to `[]`

Canonical mapping rules:

```js
const installRoot = manager.root || ".agents";
const installSkills = manager.skills || "all";
const installOmit = manager.omit || [];
```

b?????????????????????????????

Create these files under `scripts/`:

- `install-agents.sh`: POSIX/Linux Bash wrapper.
- `install-agents.cmd`: Windows CMD wrapper.
- `install-agents.js`: Node.js implementation shared by both wrappers.

Syntax for running the scripts is:

```text
install-agents <agent-manager> [target-repository]
```

- `<agent-manager>` is the key of the agent manager to install. The agent manager is a key in `agents/model-setup.json` (currently `copilot` and `devin`). Do not infer or silently fall back to another manager.

- `[target-repository]` is the optional path to the target repository, defaulting to the current directory (`.`).

## Available resources in the user's environment

Expect the following tools are available in the user's environment:

- [curl](https://curl.se/)
- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- Git (command-line tool)

Do not add other dependencies.

## Source acquisition

The installer is intended to be downloaded and run outside a clone of this repository. Therefore the Node implementation must:

1. Use a temporary directory created through Node's filesystem APIs.
2. Clone/download the repository contents into that directory with `git` (use a pinned configurable repository URL, defaulting to this GitHub repository, and a shallow clone is acceptable).
3. Always clean up the temporary directory in a `finally` path, including on validation or copy failures.

The implementation may use the checked-out script directory as a local source only when that is clearly useful for development, but the normal standalone path must fetch from GitHub.

## Preflight behavior

Before cloning or modifying the target:

1. Require the agent-manager argument.
2. Verify `git` is executable on `PATH` by running a cheap version check. If unavailable, print an actionable error and exit non-zero.
3. Load the manager configuration and validate the requested manager. A missing manager is an error and must exit non-zero.
4. Ask for confirmation on an interactive terminal. Proceed only for an explicit affirmative response such as `y` or `yes`, case-insensitive. Any other response, including EOF, is a clean cancellation with exit code zero.

The confirmation must happen before installation writes. Configuration/source validation may happen before the prompt only if needed to produce an accurate confirmation summary; never write before confirmation.

## Configuration contract

Read `agents/model-setup.json` as JSON and locate the entry under `agentManagers[agent-manager]`. Support the repository's current property names:

- `root` is the install root (the prose requirement calls this `install_root`).
- `skills` is either `"all"` or an array of skill directory names (the prose requirement calls this `install_skills`).
- `omit` is an array of names (the prose requirement calls this `install_omit`).

For forward compatibility, accepting the prose aliases `install_root`, `install_skills`, and `install_omit` is reasonable, but do not weaken validation. Require a non-empty root, a valid skills selection, and an array for omit. Reject path traversal, absolute paths, and malformed values.

## Installation behavior

After confirmation:

1. Create `<target>/<root>` recursively.
2. Copy selected directories from the fetched `skills/` directory into that root.
3. When skills is `"all"`, select every skill directory. When it is an array, select only named skill directories and fail clearly if a requested skill does not exist.
4. Apply omit rules while copying both `skills/` and the selected agent directory from `agents/`:
   - Names ending in `/` omit a directory and everything below it.
   - Other names omit matching files only.
   - Matching should be relative to the copied source tree, with normalized separators, and must not allow escaping the source tree.
5. Find `agents/<agent-manager>/AGENTS.md` and copy it to `<target>/AGENTS.md`.
6. If `<target>/AGENTS.md` already exists, preserve its contents and append a clear separator line plus the fetched contents. Do not duplicate a separator or destroy the existing file on a failed copy.

The current `devin` omit rule includes `agents/`; interpret that rule relative to the copied skills/agents content as configured, but do not omit the required final `AGENTS.md` itself. Keep the implementation behavior deterministic and document any unavoidable interpretation in code-level tests.

## Safety and failure behavior

- Use `path.resolve`, `path.relative`, and filesystem APIs rather than shell string concatenation for copy destinations.
- Avoid shell interpolation of user input. Pass git arguments as an argument array.
- Fail non-zero on malformed JSON, unknown manager, missing source files, invalid configuration, clone failure, or copy failure.
- Print concise errors to stderr and return a non-zero exit code; do not expose stack traces for ordinary user errors.
- Do not partially append to an existing `AGENTS.md`; build the final content first, then write it.
- Preserve existing unrelated files in the target repository.

## Wrapper requirements

The Bash wrapper must locate `install-skills.js` relative to its own script location, preserve all arguments, use `node`, and propagate Node's exit code. The CMD wrapper must do the equivalent with `%~dp0`, quote paths safely, preserve `%*`, and propagate the exit code. Include a usage error when Node is missing if it can be detected without masking the Node implementation's errors.

## Verification

Add a lightweight test strategy that does not require network access for every case. The preferred approach is to expose the Node implementation's core functions behind a module boundary and test them with temporary fixture directories, or provide a local-source mode used only by tests. Cover at least:

- missing manager and unknown manager;
- cancellation and affirmative confirmation;
- `skills: "all"` and an explicit skill list;
- file and directory omit rules;
- append behavior for an existing `AGENTS.md`;
- path traversal rejection and cleanup after failure;
- wrapper argument forwarding where the host platform permits it.

Run the available Node test command and shell syntax checks. Do not commit generated files or modify unrelated documentation.

## Acceptance checklist

- Both wrappers execute the shared implementation on their supported platforms.
- No installation writes occur before confirmation.
- Git is checked before installation.
- The fetched configuration controls root, selected skills, and omit rules.
- Unknown managers and invalid configuration fail clearly.
- Temporary checkout cleanup occurs on success and failure.
- Existing target instructions are preserved with a separator.
- Tests or an equivalent reproducible fixture check cover the risky copy and path logic.
