# Publication Versioning Strategy

## Overview

This document defines the versioning strategy for all publications in the AI Agents Research Publishing Project. Consistent versioning ensures readers can track updates and understand the evolution of our content.

---

## Version Numbering Scheme

We follow **Semantic Versioning** principles adapted for content:

| Version Type | Format | Description                                 | Example        |
| ------------ | ------ | ------------------------------------------- | -------------- |
| **Major**    | vX.0   | Significant rewrites or fundamental changes | v1.0, v2.0     |
| **Minor**    | vX.Y   | Content updates, additions, clarifications  | v1.1, v1.2     |
| **Patch**    | vX.Y.Z | Typo fixes, minor corrections               | v1.1.1, v1.1.2 |

### Version Format

- Full format: `vMAJOR.MINOR.PATCH` (e.g., v1.2.3)
- Abbreviated for display: `vMAJOR.MINOR` (e.g., v1.2)

---

## When to Version

### No Version Change Needed

These changes do not require a version increment:

- Typo fixes (single character)
- Grammar corrections
- Link updates (same destination, different URL)
- Formatting adjustments
- Metadata updates

### Patch Version (vX.Y.Z)

Increment patch for:

- Multiple typo fixes in one update
- Minor wording improvements
- Broken link fixes
- Code snippet corrections (non-functional)

### Minor Version (vX.Y)

Increment minor for:

- Updated statistics or data
- New examples added
- Section clarifications
- Additional resources or references
- Code example updates (functional changes)
- New subsections within existing structure

### Major Version (vX.0)

Increment major for:

- Significant new research findings
- Structural reorganization
- Major content additions (new sections)
- Fundamental changes to recommendations
- Technology updates that change core guidance
- Complete content rewrites

---

## Version Tracking

### Current Publication Versions

| Post                           | Current Version | Last Updated | Status          | Changes Summary      |
| ------------------------------ | --------------- | ------------ | --------------- | -------------------- |
| anchor.mdx                     | v1.0            | Dec 2025     | Initial Release | Original publication |
| _[Add new posts as published]_ |                 |              |                 |                      |

### Version History Template

For each publication, maintain a version history section:

```markdown
## Version History

| Version | Date       | Author | Changes                          |
| ------- | ---------- | ------ | -------------------------------- |
| v1.0    | 2025-12-03 | Team   | Initial publication              |
| v1.1    | 2026-03-15 | Team   | Updated Q1 2026 statistics       |
| v2.0    | 2026-06-01 | Team   | Major rewrite with new framework |
```

---

## Change Log Template

Use this format for detailed change documentation:

```markdown
## [1.1.0] - 2026-03-15

### Added

- Updated statistics for Q1 2026
- New example demonstrating agent memory patterns
- Additional resources section

### Changed

- Clarified framework implementation section
- Updated code examples to latest SDK version
- Revised recommendations based on new research

### Fixed

- Broken link to MCP documentation
- Typo in architecture diagram caption
- Incorrect code indentation in examples

### Deprecated

- Old API endpoints (replaced in v1.0.x)

### Removed

- Outdated tool references
```

---

## Display Strategy

### Reader-Facing Version Display

1. **Last Updated Date**: Always show on posts

   ```
   Last updated: March 15, 2026
   ```

2. **Version Badge** (optional for major releases):
   ```
   Version 2.0 | Last updated: March 15, 2026
   ```

### Social Media Promotion Guidelines

| Version Type | Promotion Action                                |
| ------------ | ----------------------------------------------- |
| Patch        | No promotion needed                             |
| Minor        | Optional mention in regular updates             |
| Major        | Full social promotion as "Updated" or "Revised" |

### Major Version Promotion Template

```
Updated: [Post Title]

We've significantly updated our guide on [topic] with:
- [Key change 1]
- [Key change 2]
- [Key change 3]

Read the new version: [link]
```

---

## Implementation Workflow

### Pre-Update Checklist

- [ ] Determine version increment type
- [ ] Update version number in post metadata
- [ ] Update "Last Updated" date
- [ ] Document changes in change log
- [ ] Update version tracking table
- [ ] Review promotion requirements

### Post Metadata Format

```yaml
---
title: 'Post Title'
version: '1.1.0'
publishedAt: '2025-12-03'
lastUpdated: '2026-03-15'
---
```

---

## Archival Policy

- **Major versions**: Archive previous major version content
- **Minor/Patch versions**: No archival needed (overwrite)
- **Archive location**: `/archive/[post-slug]/v[X].0/`

---

## Review Schedule

| Review Type    | Frequency | Action                            |
| -------------- | --------- | --------------------------------- |
| Link Check     | Monthly   | Verify all external links         |
| Content Review | Quarterly | Assess for outdated information   |
| Major Review   | Annually  | Evaluate for major version update |

---

_Document Version: v1.0 | Created: December 2025_
