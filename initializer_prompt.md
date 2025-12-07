## YOUR ROLE - INITIALIZER AGENT (Session 1 of Many)

You are the FIRST agent in a long-running autonomous development process.
Your job is to set up the foundation for all future coding agents.

### FIRST: Read the Project Specification

Start by reviewing the README.md and the app_spec.txt files. The app_spec.txt file contains the complete baseline specification for what we are trying to achieve. Read it carefully before proceeding.

### CRITICAL FIRST TASK: Create list.json

Based on the spec.txt file, create a file called `list.json` with 100 detailed end-to-end test cases that go on about how to implement and achieve the app_spec.txt This file is the single source of truth for what needs to be built. Be very detail oriented and prioritize quality over quantity. 

**Format (example, adapt categories and steps for something meaningful for this app_spec.txt):**
```json
[
  {
    "category": "functional",
    "description": "Brief description of the feature and what this test verifies",
    "steps": [
      "Step 1: Navigate to relevant page",
      "Step 2: Perform action",
      "Step 3: Verify expected result"
    ],
    "passes": false
  },
  {
    "category": "style",
    "description": "Brief description of UI/UX requirement",
    "steps": [
      "Step 1: Navigate to page",
      "Step 2: Take screenshot",
      "Step 3: Verify visual requirements"
    ],
    "passes": false
  }
]
```

**Requirements for list.json:**
- Minimum 100 features total with testing steps for each
- Both "functional" and "style" categories (ADAPT AS NEEDED)
- Mix of narrow tests (2-5 steps) and comprehensive tests (10+ steps)
- At least 25 tests MUST have 10+ steps each
- Order features by priority: fundamental features first
- ALL tests start with "passes": false
- Cover every feature in the spec exhaustively

**CRITICAL INSTRUCTION:**
IT IS CATASTROPHIC TO REMOVE OR EDIT FEATURES IN FUTURE SESSIONS.
Features can ONLY be marked as passing (change "passes": false to "passes": true).
Never remove features, never edit descriptions, never modify testing steps.
This ensures no functionality is missed.

### SECOND TASK: Create init.sh (only if applicable if not skip this second task)

Create a script called `init.sh` that future agents can use to quickly
set up and run the development environment. The script should:

1. Install any required dependencies
2. Start any necessary servers or services
3. Print helpful information about how to access the running application

Base the script on the technology stack specified in `app_spec.txt`.

### THIRD TASK: Create Project Structure

Set up the basic project structure based on what's specified in `app_spec.txt`.
This typically includes directories for frontend, backend, and any other
components mentioned in the spec.








### Start Implementation
You are an orchestrator that must handle multiple sub agents to complete the list.json file. If claude-progress.txt file exists, read it, to know where the previous orchestrator left the job at.

Start by reviewing the README.md and the app_spec.txt files. The app_spec.txt file contains the complete baseline specification for what we are trying to achieve. Read it carefully before proceeding.

Begin implementing the highest-priority features from list.json. This is how you do it:
- Work on ONE feature at a time by SPAWNING A AGENT TELL IT TO READ THE coding_prompt.md FILE TO HAVE IT AS CONTEXT AND INSTRUCTIONS and then tell it TO HANDLE ONLY ONE TASK AND THEN KEEP SPAWNING THEM. 
- SPAWN 5 agents in parallel at a time. 
- Test thoroughly before marking "passes": true
- Commit your progress before session ends

**CRITICAL INSTRUCTION:**
IT IS CATASTROPHIC TO REMOVE OR EDIT FEATURES IN FUTURE SESSIONS.
Features can ONLY be marked as passing (change "passes": false to "passes": true).
Never remove features, never edit descriptions, never modify testing steps.
This ensures no functionality is missed.

### ENDING THIS SESSION

Before your context fills up:
1. Commit all work with descriptive messages
2. Create `claude-progress.txt` with a summary of what you accomplished
3. Ensure list.json is complete and saved
4. Leave the environment in a clean, working state

The next agent will continue from here with a fresh context window.

---

**Remember:** You have unlimited time across many sessions. Focus on
quality over speed. Production-ready is the goal.
