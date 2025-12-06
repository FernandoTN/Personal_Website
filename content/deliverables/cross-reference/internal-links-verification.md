# Internal Links Verification

**Verification Date:** 2025-12-03
**Scope:** 25 blog posts in AI Agents Research Publishing Project
**Reference Document:** `/Users/fernandotn/Downloads/390/publishing/deliverables/cross-linking-report.md`

---

## Link Audit Summary

The cross-linking report identified internal links across all 25 blog posts in the publication series. Each post (except one) contains a footer reference linking back to the main research overview post.

### Source of Truth

- **Anchor Publication:** `2025-12-ai-agents-research-overview.mdx`
- **Expected URL Path:** `/blog/ai-agents-research-overview`

---

## Verification Status

| Metric                           | Count |
| -------------------------------- | ----- |
| **Total internal links**         | 24    |
| **Valid links**                  | 1     |
| **Broken/incorrect links**       | 23    |
| **Posts without internal links** | 1     |

**Link Accuracy Rate:** 4.2% (1/24)

---

## Link Corrections Needed

| File                                      | Current Link                        | Correct Link                        | Status    |
| ----------------------------------------- | ----------------------------------- | ----------------------------------- | --------- |
| 2025-12-ai-agents-research-overview.mdx   | `/blog/ai-agents-research`          | `/blog/ai-agents-research-overview` | NEEDS FIX |
| 2025-12-system-integration-92-percent.mdx | `/blog/ai-agents-research`          | `/blog/ai-agents-research-overview` | NEEDS FIX |
| 2025-12-40-percent-context-rule.mdx       | `/blog/ai-agents-research`          | `/blog/ai-agents-research-overview` | NEEDS FIX |
| 2025-12-framework-abandonment.mdx         | `/blog/ai-agents-research`          | `/blog/ai-agents-research-overview` | NEEDS FIX |
| 2025-12-demo-production-chasm.mdx         | `/blog/ai-agents-research`          | `/blog/ai-agents-research-overview` | NEEDS FIX |
| 2025-12-enterprise-business-case.mdx      | `/blog/ai-agents-research`          | `/blog/ai-agents-research-overview` | NEEDS FIX |
| 2025-12-coding-agent-exception.mdx        | `/blog/ai-agents-research`          | `/blog/ai-agents-research-overview` | NEEDS FIX |
| 2025-12-model-myth.mdx                    | `/blog/ai-agents-research`          | `/blog/ai-agents-research-overview` | NEEDS FIX |
| 2025-12-dual-memory-architecture.mdx      | `/blog/ai-agents-research`          | `/blog/ai-agents-research-overview` | NEEDS FIX |
| 2025-12-mcp-tool-cliff.mdx                | `/blog/ai-agents-research`          | `/blog/ai-agents-research-overview` | NEEDS FIX |
| 2025-12-handoff-rate-metric.mdx           | `/blog/ai-agents-research`          | `/blog/ai-agents-research-overview` | NEEDS FIX |
| 2025-12-component-evaluation.mdx          | `/blog/ai-agents-research`          | `/blog/ai-agents-research-overview` | NEEDS FIX |
| 2025-12-evaluation-gap.mdx                | `/blog/ai-agents-research`          | `/blog/ai-agents-research-overview` | NEEDS FIX |
| 2025-12-practitioner-interview-2.mdx      | `/blog/ai-agents-research`          | `/blog/ai-agents-research-overview` | NEEDS FIX |
| 2025-12-practitioner-interview-1.mdx      | `/blog/ai-agents-research`          | `/blog/ai-agents-research-overview` | NEEDS FIX |
| 2025-12-practitioner-interview-3.mdx      | `/blog/ai-agents-research`          | `/blog/ai-agents-research-overview` | NEEDS FIX |
| 2025-12-practitioner-interview-4.mdx      | `/blog/ai-agents-research`          | `/blog/ai-agents-research-overview` | NEEDS FIX |
| 2025-12-practitioner-interview-5.mdx      | `/blog/ai-agents-research`          | `/blog/ai-agents-research-overview` | NEEDS FIX |
| 2025-12-shopping-agent.mdx                | `/blog/ai-agents-research`          | `/blog/ai-agents-research-overview` | NEEDS FIX |
| 2025-12-repo-patcher.mdx                  | `/blog/ai-agents-research-overview` | `/blog/ai-agents-research-overview` | VALID     |
| 2025-12-good-agents.mdx                   | `/blog/ai-agents-research`          | `/blog/ai-agents-research-overview` | NEEDS FIX |
| 2025-12-autonomous-agent-fireside.mdx     | `/blog/ai-agents-research`          | `/blog/ai-agents-research-overview` | NEEDS FIX |
| 2025-12-why-95-fail.mdx                   | `/blog/ai-agents-research`          | `/blog/ai-agents-research-overview` | NEEDS FIX |
| 2025-12-production-summit.mdx             | `/blog/ai-agents-research`          | `/blog/ai-agents-research-overview` | NEEDS FIX |
| 2025-12-research-methodology.mdx          | (no internal links)                 | N/A                                 | NO LINK   |

---

## Issue Details

### Primary Issue: Path Mismatch

The footer link text in 23 posts uses:

```markdown
[Read the full research overview](/blog/ai-agents-research)
```

However, the anchor publication filename is `2025-12-ai-agents-research-overview.mdx`, which renders as URL path `/blog/ai-agents-research-overview`.

The link is missing the `-overview` suffix, causing a 404 error when clicked.

### Verified Correct Link

Only `2025-12-repo-patcher.mdx` contains the correct link:

```markdown
[Read the full research overview](/blog/ai-agents-research-overview)
```

---

## Recommendations

### Immediate Actions (Critical)

1. **Fix 23 broken footer links** - Replace `/blog/ai-agents-research` with `/blog/ai-agents-research-overview` in all affected files

2. **Add link to research-methodology.mdx** - This post is missing the standard footer link to the research overview

### Optional Enhancements

3. **Implement redirect** - Configure a redirect from `/blog/ai-agents-research` to `/blog/ai-agents-research-overview` as a fallback for any external references

4. **Add thematic cross-links** - The cross-linking report identifies 20 opportunities for related posts to link to each other (see cross-linking-report.md for details)

---

## Fix Instructions

To fix all broken links, replace the following text in each affected file:

**Find:**

```markdown
[Read the full research overview](/blog/ai-agents-research)
```

**Replace with:**

```markdown
[Read the full research overview](/blog/ai-agents-research-overview)
```

### Files Requiring Update (23 total):

1. 2025-12-ai-agents-research-overview.mdx (line 104)
2. 2025-12-system-integration-92-percent.mdx (line 113)
3. 2025-12-40-percent-context-rule.mdx (line 113)
4. 2025-12-framework-abandonment.mdx (line 130)
5. 2025-12-demo-production-chasm.mdx (line 132)
6. 2025-12-enterprise-business-case.mdx (line 118)
7. 2025-12-coding-agent-exception.mdx (line 140)
8. 2025-12-model-myth.mdx (line 170)
9. 2025-12-dual-memory-architecture.mdx (line 187)
10. 2025-12-mcp-tool-cliff.mdx (line 138)
11. 2025-12-handoff-rate-metric.mdx (line 113)
12. 2025-12-component-evaluation.mdx (line 113)
13. 2025-12-evaluation-gap.mdx (line 179)
14. 2025-12-practitioner-interview-2.mdx (line 140)
15. 2025-12-practitioner-interview-1.mdx (line 129)
16. 2025-12-practitioner-interview-3.mdx (line 132)
17. 2025-12-practitioner-interview-4.mdx (line 135)
18. 2025-12-practitioner-interview-5.mdx (line 114)
19. 2025-12-shopping-agent.mdx (line 135)
20. 2025-12-good-agents.mdx (line 155)
21. 2025-12-autonomous-agent-fireside.mdx (line 113)
22. 2025-12-why-95-fail.mdx (line 141)
23. 2025-12-production-summit.mdx (line 151)

---

## Status: NEEDS FIXES

**Summary:**

- **23 links need to be corrected** (broken path mismatch)
- **1 post needs a link added** (research-methodology.mdx)
- **1 link verified as correct** (repo-patcher.mdx)

**Severity:** HIGH - 96% of internal links will result in 404 errors

---

_Verification performed: 2025-12-03_
_Reference: cross-linking-report.md_
