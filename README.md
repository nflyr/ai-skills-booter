# ai-skills-booter

A CLI tool for bootstrapping AI skills and agents into local repositories from github, with a customized installation script for specific Agent Managers.

Keep only the `install-skills` script on your system, and use it to bootstrap the skills setup into your repository from github.

Requires the `git` command line tool.

Example:

```bash
install-skills copilot .
```

If you need to login to github, you can use the `gh` command line tool to authenticate first:

```bash
gh auth login
gh auth setup-git
# (now open a new terminal)
install-skills copilot .
```

The current development has a focus on Copilot and Devin, but the tool is designed to be extensible to other agent managers in the future.

A large portion of the contents of the sub-folder `skills` is originally based on the work of [Matt Pocock](https://github.com/mattpocock/skills).

## TODO

[90%] Add a description of the project and its purpose.

[done] Add a copyright notice with credits to Matt Pocock.

[80%] Build a script to automate the setup of the development environment.

[ ] Implement a basic skill invocation policy (sub-agents).

[ ] Improve the SKILL policy to Copilot.

[ ] Improve the SKILL policy to Devin (work).
