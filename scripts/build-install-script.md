# Build install script

You job is to build a script that installs and sets up a skills environment fir Ai agents ina given repository.

## Requirements

- The script is to be named `install-skills` and is to be placed in the scripts folder of this repository. It then can be downloaded by the user into the local system and can be run from there to set up the skills environment of any local repository.

- There shoud be a Windows CMD version and a Linux Bash version of the script.

- The script receives as input the name of the agent manager to be used, e.g. `copilot`, `devin`, etc. If no argument is provided, the script should display an error message, and exit with a non-zero exit code. Let's call this input argument `agent_manager`.

- Before executing the install, the script MUST:
  - Check if the `git` command line tool is available in the system path. If not, it should display an error message and exit with a non-zero exit code.
  - Ask the user to confirm that they want to proceed with the installation. If the user does not confirm, the script should exit with a zero exit code.

- To install the skills environment, the script MUST:
  1. Create a temporary folder in the system temp folder, and download into it all the contents of the `skills` folder and all the contents of the `agents` folder.
  2. Load the `model-setup.json` int memory and search for an entry with the name equal to the value of the `agent_manager` argument. If no entry is found, the script should display an error message and exit with a non-zero exit code.
  3. Evaluate three key values from the entry found in the `model-setup.json` file in the attibute with name equal to the value of the `agent_manager` argument:
     - `install_root`, the name of the root folder for agent amanager specific files and configuration.
     - `install_skills`, the list of skills to be installed for the slected agent_manager. If the value is "all", all the skills in the `skills` folder should be installed. If the value is a list of skill names, only those skills should be installed.
     - `install_omit`, a list of folder or file names to be omitted when copying the contents of the `skills` and `agents` folders into the target repository. Names that end with a slash are considered folder names, and all their contents will be omitted. Names that do not end with a slash are considered file names, and only those files will be omitted.
  4. Create the folder named `install_root` in the root of the target repository, and copy into it:
     - The contents of the `skills` folder, considering the `install_skills` and `install_omit` values acording to the rules described for those values.
  5. Copy the file named `AGENTS.md` from the folder with name equal to the value of the `agent_manager` inside the folder `agents`into the root of the target repository. If there is already a file with this name in the target repository, append the contents of the new file to the existing file, and add a separator line between the two contents.

## Resources available to the script

- Assume that the local system where the script is to be executed has the following resources available:
  - Access to the internet, and can download the contents of this repository from github.
  - The `git` command line tool, expected to be available in the system path.
  - The `node.js` runtime, expected to be available in the system path.

## Recommendations

- Due to the complexity of the installation process, i suggest that a javascript implementation of the script is built, and then a Windows CMD and a Linux Bash wrapper scripts are built to call the javascript script with the appropriate arguments ui«sing the node.js runtime.
