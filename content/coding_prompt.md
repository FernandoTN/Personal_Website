## YOUR ROLE - CODING AGENT

You are continuing work on the **AI Agents Research Publication Series** implementation.
This is a FRESH context window - you have no memory of previous sessions.

### PROJECT CONTEXT (READ THIS FIRST)

**Project:** Fernando Torres Personal Website with AI Agents Research Publication Series
**Location:** `/Users/fernandotn/Projects/FernandoTorresWebsite/`
**Website:** https://fernandotorres.io

**Tech Stack:**

- Framework: Next.js 14 (App Router)
- Language: TypeScript
- Content: Contentlayer + MDX
- Styling: Tailwind CSS
- Hosting: GitHub Pages (static export)
- Package Manager: pnpm

**What We're Building:**

- 25 scheduled blog posts (auto-reveal system)
- Admin dashboard for content management
- LinkedIn integration (manual + auto-post)
- Analytics dashboard (Plausible)
- Final Report showcase page

**Key Constraints:**

- Static hosting only (no server runtime)
- Cloudflare Workers for LinkedIn API
- 19 confidential interviews - never disclose names/companies
- Practitioner posts require explicit attribution permission

---

### STEP 1: GET YOUR BEARINGS (MANDATORY)

Start by orienting yourself:

```bash
# 1. Confirm working directory
cd /Users/fernandotn/Projects/FernandoTorresWebsite
pwd

# 2. Understand project structure
ls -la
ls -la app/
ls -la content/blog/
ls -la data/

# 3. Read the implementation specification
cat publishing/IMPLEMENTATION_SPEC.md | head -200

# 4. Read the feature list to see all work
cat publishing/list.json | head -50

# 5. Read progress notes from previous sessions
cat publishing/claude-progress.txt

# 6. Check recent git history
git log --oneline -10

# 7. Count remaining tests
grep -c '"passes": false' publishing/list.json
```

**Understanding the `publishing/IMPLEMENTATION_SPEC.md` is critical** - it contains the full requirements for what you're building.

---

### STEP 2: START DEV SERVER (IF NOT RUNNING)

```bash
# Check if server is running
lsof -i :3000

# If not running, start it:
pnpm dev
```

The website should be accessible at http://localhost:3000/

---

### STEP 3: VERIFICATION TEST (CRITICAL!)

**MANDATORY BEFORE NEW WORK:**

The previous session may have introduced bugs. Before implementing anything new:

1. Run 1-2 feature tests marked as `"passes": true` that are core to functionality
2. For this project, verify:
   - Blog listing loads at `/blog`
   - Individual blog posts render properly
   - Admin routes (if implemented) require authentication

**If you find ANY issues:**

- Mark that feature as `"passes": false` immediately
- Fix all issues BEFORE moving to new features
- Issues include:
  - Build failures (`pnpm build` must succeed)
  - Console errors
  - Layout/styling problems
  - Broken navigation
  - Contentlayer errors

---

### STEP 4: CHOOSE ONE FEATURE TO IMPLEMENT

Look at `publishing/list.json` and find the highest-priority feature with `"passes": false`.

**Priority order (if uncertain):**

1. Content structure & MDX files
2. Build-time features (date filtering, Contentlayer schema)
3. Frontend pages (blog listing, research page)
4. Admin dashboard
5. LinkedIn integration
6. Analytics

Focus on completing **ONE feature perfectly** this session.

---

### STEP 5: IMPLEMENT THE FEATURE

**Implementation Guidelines:**

1. **For MDX/Content changes:**
   - Blog posts go in `/content/blog/`
   - Update Contentlayer schema in `contentlayer.config.js`
   - Data files go in `/data/` (JSON format)

2. **For React components:**
   - App routes in `/app/`
   - Shared components in `/components/`
   - Use existing design tokens (check `tailwind.config.js`)

3. **For API routes:**
   - Static site = no runtime APIs
   - Use Cloudflare Worker for external API calls
   - Worker code in `/cloudflare-worker/`

4. **Always verify:**
   ```bash
   pnpm build  # Must succeed for GitHub Pages
   ```

---

### STEP 6: VERIFY THE FEATURE

**For Frontend Features:**

- Navigate to the page in browser (localhost:3000)
- Test interactions (clicks, navigation)
- Check browser console for errors
- Verify responsive design

**For Build-Time Features:**

- Run `pnpm build` and check output
- Verify filtered posts appear correctly
- Check generated static files in `/out/`

**For Data/Content Features:**

- Verify MDX files have valid frontmatter
- Check Contentlayer generates without errors
- Verify content appears correctly on pages

**CRITICAL:** You MUST verify features through the actual UI using the MCP Pupeeter. (ONLY IF APPLICABLE, BUT STILL NEED TO VERIFY THROUGH SOME METHOD)

Use browser automation tools:

- Navigate to the app in a real browser
- Interact like a human user (click, type, scroll)
- Take screenshots at each step
- Verify both functionality AND visual appearance

**DO:**

- Test through the UI with clicks and keyboard input
- Take screenshots to verify visual appearance
- Check for console errors in browser
- Verify complete user workflows end-to-end

**DON'T:**

- Only test with curl commands (backend testing alone is insufficient)
- Use JavaScript evaluation to bypass UI (no shortcuts)
- Skip visual verification
- Mark tests passing without thorough verification

**ALL testing must use browser automation tools.**
Available tools:

- puppeteer_navigate - Start browser and go to URL
- puppeteer_screenshot - Capture screenshot
- puppeteer_click - Click elements
- puppeteer_fill - Fill form inputs
- puppeteer_evaluate - Execute JavaScript (use sparingly, only for debugging)

Test like a human user with mouse and keyboard. Don't take shortcuts by using JavaScript evaluation.
Don't use the puppeteer "active tab" tool.

---

### STEP 7: UPDATE publishing/list.json (CAREFULLY!)

**YOU CAN ONLY MODIFY ONE FIELD: "passes"**

After thorough verification, change:

```json
"passes": false
```

to:

```json
"passes": true
```

**NEVER:**

- Remove tests
- Edit test descriptions
- Modify test steps
- Combine or reorder tests

---

### STEP 8: COMMIT YOUR PROGRESS

```bash
git add .
git commit -m "Implement [feature name] - verified

- Added [specific changes]
- Updated publishing/list.json: marked test #X as passing
- Build verified with pnpm build
"
```

---

### STEP 9: UPDATE PROGRESS NOTES

Update `publishing/claude-progress.txt` with:

- What you accomplished this session
- Which test(s) you completed
- Any issues discovered or fixed
- What should be worked on next
- Current status (e.g., "45/250 tests passing")

---

### STEP 10: END SESSION CLEANLY

Before context fills up:

1. Commit all working code
2. Update `publishing/claude-progress.txt`
3. Update `publishing/list.json` if tests verified
4. Run `pnpm build` to ensure nothing is broken
5. Leave app in working state

---

## KEY FILE LOCATIONS

| File                                | Purpose                              |
| ----------------------------------- | ------------------------------------ |
| `publishing/IMPLEMENTATION_SPEC.md` | Full implementation specification    |
| `publishing/list.json`              | Feature tests (only modify "passes") |
| `publishing/claude-progress.txt`    | Session progress notes               |
| `content/blog/*.mdx`                | Blog posts (MDX with frontmatter)    |
| `data/linkedin-posts.json`          | LinkedIn post content                |
| `data/publication-calendar.json`    | Publication schedule                 |
| `contentlayer.config.js`            | Content schema definition            |
| `app/admin/`                        | Admin dashboard routes               |
| `app/research/`                     | Final Report page                    |

---

## IMPORTANT REMINDERS

**Your Goal:** Production-quality implementation with all 250 tests passing

**This Session's Goal:** Complete at least one feature perfectly

**Priority:** Fix broken tests before implementing new features

**Quality Bar:**

- `pnpm build` succeeds (required for GitHub Pages)
- Zero console errors
- Polished UI matching spec
- All features work end-to-end

**Privacy Rules:**

- Never disclose names/companies from 19 confidential interviews
- Use "Multiple interviewees noted..." for anonymous quotes
- Practitioner posts (#14-18) require explicit permission

---

Begin by running Step 1 (Get Your Bearings).
