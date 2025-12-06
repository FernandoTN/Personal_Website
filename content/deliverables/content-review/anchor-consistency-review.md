# Anchor Publication Consistency Review

**Document**: `2025-12-ai-agents-research-overview.mdx`
**Review Date**: December 3, 2025
**Reviewer**: AI Sub-Agent

---

## Comparison: Anchor Post vs Source Documents

### Key Findings Alignment

| Finding                                          | In Final Report                                                                                               | In Anchor Post                                                                                             | Match     |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | --------- |
| 30-40% model contribution                        | Yes - "Models contribute only 30-40% to agent success"                                                        | Yes - "Model only contributes 30-40% of the whole thing"                                                   | **MATCH** |
| 60-70% framework/architecture contribution       | Yes - "remaining 60-70% comes from framework architecture, system integration, and evaluation infrastructure" | Yes - "framework architecture, orchestration patterns, context engineering, and evaluation infrastructure" | **MATCH** |
| 92% system integration mentions                  | Yes - "System Integration appeared in 92% of our sources"                                                     | Yes - "System Integration appeared in 92% of sources"                                                      | **MATCH** |
| 90% pilot failure rate                           | Yes - "Ninety percent of enterprise pilots fail"                                                              | Yes - "Ninety percent of enterprise AI agent pilots never convert to production"                           | **MATCH** |
| 80-90% framework abandonment                     | Yes - "80-90% of production teams abandon them"                                                               | Yes - "80-90% of production teams abandon it"                                                              | **MATCH** |
| 40-50% deployment time on integration            | Yes - "consuming 40-50% of all deployment time"                                                               | Yes - "40-50% of deployment time to be spent on integration"                                               | **MATCH** |
| 40% context utilization rule                     | Yes - "40% context utilization rule"                                                                          | Yes - "40% context utilization rule"                                                                       | **MATCH** |
| 25-tool MCP accuracy threshold                   | Yes - "more than 25 MCP tools, accuracy drops to 30%"                                                         | Yes - "MCP tool accuracy cliff: 25 tools, then 30% accuracy"                                               | **MATCH** |
| Production agents = engineering problem          | Yes - "production AI agents are an engineering problem, not an AI problem"                                    | Yes - "Production AI agents are an engineering problem, not an AI problem"                                 | **MATCH** |
| Model capabilities lowest theme (62%)            | Yes - "Model Capabilities appeared in only 62% of sources—the lowest among core themes"                       | Yes - "Model Capabilities appeared in only 62% of sources—the lowest of the six core themes"               | **MATCH** |
| Framework & Tooling (85%)                        | Yes - implied in theme frequency table                                                                        | Yes - "Framework and Tooling Ecosystem in 85%"                                                             | **MATCH** |
| Business case failure precedes technical failure | Yes - "business case failure precedes technical failure"                                                      | Yes - "Business Case Failure Precedes Technical Failure" (section heading)                                 | **MATCH** |
| Handoff rate as key metric                       | Yes - "handoff rate—the percentage of tasks requiring human intervention"                                     | Yes - "Measure handoff rate (tasks passed to humans) as your north star metric"                            | **MATCH** |

---

### Statistics Verification

| Statistic                           | Final Report Value                              | Anchor Post Value                     | Status        |
| ----------------------------------- | ----------------------------------------------- | ------------------------------------- | ------------- |
| Expert interviews conducted         | 36                                              | 36                                    | **MATCH**     |
| Industry conferences attended       | 5                                               | 5                                     | **MATCH**     |
| Functional prototypes built         | 3                                               | 3                                     | **MATCH**     |
| Research duration                   | "ten weeks" / "September through November 2024" | "10-week study" / "Autumn 2024"       | **MATCH**     |
| Production conversion rate          | "around 10%"                                    | "around 10%" (implied by 90% failure) | **MATCH**     |
| Model contribution percentage       | 30-40%                                          | 30-40%                                | **MATCH**     |
| System integration theme frequency  | 92%                                             | 92%                                   | **MATCH**     |
| Framework & tooling theme frequency | 85%                                             | 85%                                   | **MATCH**     |
| Enterprise blockers theme frequency | 81%                                             | Not explicitly stated                 | **MINOR GAP** |
| Context management theme frequency  | 69%                                             | Not explicitly stated                 | **MINOR GAP** |
| Model capabilities theme frequency  | 62%                                             | 62%                                   | **MATCH**     |
| Framework abandonment rate          | 80-90%                                          | 80-90%                                | **MATCH**     |
| Custom framework performance gain   | 3-4x faster                                     | 3-4x faster                           | **MATCH**     |
| 70% demo threshold                  | 70% reliability creates demos                   | Not explicitly stated                 | **MINOR GAP** |
| Context utilization threshold       | 40%                                             | 40%                                   | **MATCH**     |
| MCP tool accuracy cliff             | 25 tools, 30% accuracy                          | 25 tools, 30% accuracy                | **MATCH**     |
| Pilot failure rate                  | 90%                                             | 90%                                   | **MATCH**     |
| Integration time percentage         | 40-50%                                          | 40-50%                                | **MATCH**     |
| Enterprise willingness to pay       | $400-750/month                                  | $400-750/month                        | **MATCH**     |
| Current startup pricing             | $20-30/month                                    | $20-30/month                          | **MATCH**     |
| Token cost per task                 | $5+                                             | $5+                                   | **MATCH**     |

---

### Quote Accuracy

| Quote                                                   | Final Report                                                                                                                                                                                  | Anchor Post                                                                                                                          | Verification                                                    |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------- |
| an AI autonomous agent company model contribution quote | "We found out actually model only maybe contributes 30 or 40% of the whole thing. And the framework, the whole system you build upon the model is much more important than the model itself." | "Model only contributes 30-40% of the whole thing. The framework, the whole system you build upon the model is much more important." | **ACCURATE** - Anchor uses condensed version, preserves meaning |
| the practitioner ROI quote                              | "Most AI agent deployments fail due to undefined ROI calculations and lack of commercial mindset, not technical limitations."                                                                 | "Most AI agent deployments fail due to undefined ROI calculations and lack of commercial mindset, not technical limitations."        | **EXACT MATCH**                                                 |
| Cynthia framework abandonment quote                     | Full quote about a popular AI agent framework bloat and 80-90% abandonment                                                                                                                    | Full quote preserved                                                                                                                 | **EXACT MATCH**                                                 |
| Production Agents Summit 40% rule                       | "If your agent is using anything more than 40% of the context window, it's probably going to make mistakes..."                                                                                | Referenced in table, not quoted directly                                                                                             | **ACCURATE** - Source attribution correct                       |

---

### Tone Consistency

| Aspect                           | Assessment | Notes                                                               |
| -------------------------------- | ---------- | ------------------------------------------------------------------- |
| Academic but accessible          | **Yes**    | Both documents use clear language while maintaining scholarly rigor |
| Matches research report tone     | **Yes**    | Anchor maintains same professional, evidence-based approach         |
| Appropriate blog post adaptation | **Yes**    | More conversational opening, maintains factual precision            |
| First-person voice consistency   | **Yes**    | Both use first-person ("I", "we") appropriately                     |
| Avoids marketing language        | **Yes**    | No hyperbole; findings presented with appropriate hedging           |

---

### Structural Comparison

| Section           | Final Report                                 | Anchor Post                            | Alignment                  |
| ----------------- | -------------------------------------------- | -------------------------------------- | -------------------------- |
| Opening/Hook      | Abstract with executive summary              | Narrative hook about 90% pilot failure | **APPROPRIATE ADAPTATION** |
| Methodology       | Full section with detailed breakdown         | Condensed "Discovery" section          | **APPROPRIATE ADAPTATION** |
| Key Findings      | "Major Learnings & Insights" (comprehensive) | "What We Found" (highlights)           | **APPROPRIATE ADAPTATION** |
| Implications      | "Future Opportunities & Challenges"          | "Why This Matters" + "What You Can Do" | **APPROPRIATE ADAPTATION** |
| Data presentation | Embedded in prose                            | Summary table included                 | **APPROPRIATE ADAPTATION** |
| Actionable advice | Implicit in findings                         | Explicit bulleted recommendations      | **APPROPRIATE ADAPTATION** |

---

### Gaps Identified

#### Content in Final Report Missing from Anchor Post

| Gap                                                                                                                                         | Severity         | Assessment                            |
| ------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- | ------------------------------------- |
| 81% enterprise blockers frequency                                                                                                           | Low              | Not critical for blog format          |
| 69% context management frequency                                                                                                            | Low              | Not critical for blog format          |
| 70% demo threshold detail                                                                                                                   | Low              | Concept covered without specific stat |
| Dual memory architecture (user vs agent memory)                                                                                             | Medium           | Interesting insight omitted           |
| Small model constellations prediction                                                                                                       | Low              | Future prediction, not core finding   |
| $10B+ evaluation market opportunity                                                                                                         | Low              | Venture-specific, appropriate to omit |
| PII detection challenges (18-24 month timeline)                                                                                             | Low              | Technical detail, appropriate to omit |
| Organizational change management (3-5 year timeline)                                                                                        | Low              | Future timeline, appropriate to omit  |
| Prototype names: Shopping Agent, Repo Patcher, Good Agents                                                                                  | Already included | **No gap**                            |
| Company names: an AI agent orchestration company, an AI infrastructure company, an AI coding company, a multi-agent framework company, etc. | Already included | **No gap**                            |
| Evaluation-as-a-Service opportunity                                                                                                         | Low              | Venture-focused, appropriate to omit  |

#### Content in Anchor Post Not in Final Report

| Addition        | Assessment                                       |
| --------------- | ------------------------------------------------ |
| None identified | Anchor does not introduce new unsupported claims |

---

### Attribution Verification

| Attributed Source                                                                   | In Anchor | In Final Report | Status    |
| ----------------------------------------------------------------------------------- | --------- | --------------- | --------- |
| an AI autonomous agent company Co-Founder (an AI autonomous agent company Fireside) | Yes       | Yes             | **MATCH** |
| an enterprise AI deployment expert                                                  | Yes       | Yes             | **MATCH** |
| Cynthia (Wise Agents)                                                               | Yes       | Yes             | **MATCH** |
| a practitioner at a CRM AI company                                                  | Yes       | Yes             | **MATCH** |
| Production Agents Summit                                                            | Yes       | Yes             | **MATCH** |
| a practitioner at an AI infrastructure company                                      | Yes       | Yes             | **MATCH** |
| a multi-agent framework company                                                     | Yes       | Yes             | **MATCH** |

---

### Minor Discrepancies Noted

| Item                            | Final Report                                                                                                     | Anchor Post                                                                                                           | Assessment                                                                                                                                                                         |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Research timing                 | "September through November 2024"                                                                                | "Autumn 2024"                                                                                                         | **EQUIVALENT**                                                                                                                                                                     |
| Semester                        | "Autumn 2025" (in header)                                                                                        | "Autumn 2024" (in text)                                                                                               | **NOTE**: Final Report header says "Autumn 2025" but text says "September through November 2024" - appears to be typo in Final Report header. Anchor correctly says "Autumn 2024". |
| Shopping Agent framework switch | "Initially implemented with LangGraph, we were forced to switch to a popular AI agent framework mid-development" | "Initially implemented with LangGraph, the team was forced to switch to a popular AI agent framework mid-development" | **EQUIVALENT** - Minor pronoun change                                                                                                                                              |

---

### Recommendations

1. **No Critical Fixes Required** - All key statistics and findings are accurately represented.

2. **Optional Enhancement** - Consider adding brief mention of "dual memory architecture" concept (user memory vs agent memory) as it's a unique insight from the research.

3. **Typo Note** - The Final Report header states "Autumn 2025" but the research was conducted in "Autumn 2024" (per the body text). The anchor post correctly states "Autumn 2024". This is a Final Report issue, not an anchor post issue.

4. **70% Demo Threshold** - The anchor post could optionally include the "70% reliability creates demos but fails production" insight with attribution to a founder at an AI infrastructure company, as it's a memorable and actionable finding.

---

## Summary Assessment

### Consistency Score: 98/100

| Category              | Score | Notes                                                    |
| --------------------- | ----- | -------------------------------------------------------- |
| Statistical Accuracy  | 100%  | All quoted statistics match source documents             |
| Quote Accuracy        | 100%  | All quotes are verbatim or appropriately condensed       |
| Finding Alignment     | 100%  | All major findings accurately represented                |
| Attribution           | 100%  | All sources correctly attributed                         |
| Tone Consistency      | 100%  | Maintains academic-accessible balance                    |
| Structural Adaptation | 95%   | Appropriate for blog format; minor omissions acceptable  |
| Completeness          | 95%   | Some secondary findings omitted (appropriate for format) |

---

## Status: **CONSISTENT**

The anchor publication accurately represents the findings from the Final Report and ProcessRecap source documents. All key statistics, quotes, and conclusions are faithfully reproduced. The blog post appropriately adapts the academic report format for broader accessibility while maintaining factual precision.

**No revisions required for accuracy. Publication approved.**

---

_Review completed: December 3, 2025_
