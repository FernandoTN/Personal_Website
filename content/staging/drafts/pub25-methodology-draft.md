# How We Processed 44 Sources Into Actionable Research

_A deep dive into the systematic methodology that transformed interviews, conferences, and prototypes into validated findings about AI agent development_

---

## The Challenge of Synthesis

When we set out to research what unlocks the full potential of AI agents, we faced a common problem in qualitative research: how do you extract meaningful patterns from dozens of conversations, presentations, and hands-on experiments without losing nuance or introducing bias?

Our source material was substantial: 36 expert interviews with founders, engineers, and product leaders building production AI agents; 5 conference talks and fireside chats from industry events; and 3 prototype implementations we built ourselves to validate theoretical findings. That's 44 distinct sources, each containing unique perspectives, contradictory claims, and varying levels of relevance to our core research questions.

The traditional approach would involve manually reviewing each source, taking notes, and synthesizing findings based on intuition. But intuition introduces bias. The most articulate speaker gets outsized influence. Recent conversations override earlier insights. Findings that confirm existing beliefs get prioritized.

We needed a methodology that would:

- Process each source with consistent rigor
- Enable quantitative analysis of qualitative data
- Surface patterns that span many sources, not just memorable quotes
- Preserve contradictions and nuance rather than forcing false consensus
- Complete the work in a reasonable timeframe

Our solution: a two-phase extraction and aggregation methodology, executed by parallel sub-agents, producing 38 intermediate documents before the final synthesis.

---

## The Two-Phase Methodology

### Phase 1: Individual Source Extraction

The first phase focused on extracting information from each source independently, before any cross-source analysis. This independence was crucial. If a sub-agent processing interview 15 knew what themes had emerged from interviews 1-14, it might unconsciously weight those themes more heavily. By isolating each extraction, we ensured findings emerged from the source material itself.

For each of the 44 sources, a dedicated sub-agent performed the following:

**Read the complete source document.** For interviews, this meant full transcripts. For conferences, detailed notes and quotes. For prototypes, implementation documentation plus lessons learned.

**Applied a standardized extraction template.** Every extraction document followed the same structure:

- Metadata: source name, type, date, participants
- 5 or more key concepts identified
- 3-5 critical quotes with speaker attribution and context
- Theme tags from 6 predefined categories
- Unique insights not captured elsewhere
- Relevance score (1-5) with written justification
- Contradictions or tensions with other known sources
- Notes flagging content for aggregation

**Tagged applicable themes.** Our six core theme categories were defined before extraction began:

1. System Integration (APIs, MCP, tool calling, custom integrations)
2. Context Management and Memory (long context, RAG, cross-session state)
3. Probabilistic Systems and Reliability (testing, evals, demo-to-production gap)
4. Model Capabilities and Limitations (what LLMs can and cannot do)
5. Enterprise Blockers and Governance (security, identity, compliance, pricing)
6. Framework and Tooling Ecosystem (a popular AI agent framework, observability, infrastructure)

**Identified emergent themes.** Beyond the predefined categories, each sub-agent flagged themes that appeared important but did not fit existing categories. This is how we discovered concepts like "handoff rate as success metric" and "dual memory architecture" that became central to our findings.

### Parallel Execution: Batches of 5

Processing 44 sources sequentially would have taken days. Instead, we spawned sub-agents in batches of 5, enabling parallel execution while maintaining system stability.

| Batch | Sources Processed                                                                                                                                                                                                                |
| ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1     | an enterprise AI deployment expert, a founder at an AI infrastructure company, Stephen (GMI), a practitioner at a CRM AI company, a practitioner                                                                                 |
| 2     | an engineering leader at a major identity company, a developer at an AI coding company, an AI lead at a sales intelligence company, an engineering leader at a workforce platform, a practitioner at an AI observability company |
| 3     | a practitioner at an AI infrastructure company, a consulting firm practitioner, ChatPRD, a multi-agent framework company, Roblox                                                                                                 |
| 4     | Zeena, a VC investor, Project Nanda, Alibaba Qwen, an AI autonomous agent company Fireside                                                                                                                                       |
| 5     | Production Agents Summit, Why 95% Fail, Shopping Agent, Repo Patcher, Good Agents                                                                                                                                                |

Each batch completed its extractions independently. Quality standards were enforced uniformly: minimum 5 key concepts, 3-5 critical quotes with context, all applicable theme tags, relevance score with justification, and explicit documentation of any contradictions.

**Output: 26 extraction documents** organized by source type (interviews, conferences, prototypes) in dedicated directories.

---

## Phase 2: Aggregation and Consolidation

With individual extractions complete, phase 2 synthesized findings across sources to reveal patterns, contradictions, and the evolution of themes throughout the research.

### Step 2.1: Theme Frequency Analysis

A dedicated sub-agent analyzed all 26 extraction documents to produce quantitative analysis of theme occurrence. This was not simply counting mentions. We calculated theme weight using the formula:

**Theme Weight = Occurrence Count x Average Relevance Score**

This meant a theme mentioned in 15 sources with average relevance of 4.5 would outweigh a theme mentioned in 20 sources with average relevance of 3.0. Quality and significance mattered, not just frequency.

The frequency analysis revealed:

| Theme                 | Occurrence Rate     | Calculated Weight |
| --------------------- | ------------------- | ----------------- |
| System Integration    | 92% (24/26 sources) | 114.0             |
| Probabilistic Systems | 85% (22/26 sources) | 106.0             |
| Framework and Tooling | 85% (22/26 sources) | 103.0             |
| Enterprise Blockers   | 81% (21/26 sources) | 98.0              |
| Context Management    | 69% (18/26 sources) | 82.0              |
| Model Capabilities    | 62% (16/26 sources) | 72.0              |

This quantitative foundation transformed our understanding. System Integration appeared in 92% of sources with the highest weight score. Model Capabilities, which we initially hypothesized as the primary bottleneck, appeared in only 62% of sources with the lowest weight. The data was telling a different story than our initial assumptions.

### Step 2.2: Theme Consolidation Documents

For each of the 6 core themes, a sub-agent created a comprehensive consolidation document synthesizing all relevant extractions. Each consolidation contained:

- Calculated weight and evolution status (emerged, grew, stable, diminished, invalidated)
- All sources referencing the theme with their key points
- A synthesized 2-3 sentence finding
- Supporting evidence with quotes from multiple sources
- Sub-themes identified within the broader category
- Contradictions and nuances between sources
- Prototype validation showing how hands-on building confirmed or denied theoretical claims
- Key takeaways flagged for the final report

This structure ensured we captured both consensus and disagreement. When sources contradicted each other, we documented both positions rather than arbitrarily choosing one.

### Step 2.3: Evolution Narrative

A final aggregation document tracked how our understanding evolved throughout the research timeline:

- Initial hypotheses before research began
- Early interview phase (first 5-6 conversations)
- Conference insights and how they shifted thinking
- Prototype validation and what building revealed
- Later interview phase with accumulated context
- Summary table showing which hypotheses were validated, invalidated, or modified
- Emergent insights that were not in our initial hypothesis set

This longitudinal view proved essential. Some themes grew dramatically in importance as research progressed (System Integration, Framework Ecosystem). Others diminished (Model Capabilities as primary bottleneck). The Evolution Narrative captured this trajectory explicitly.

---

## The Numbers: Processing Statistics

The complete methodology produced substantial documentation:

| Metric                        | Value                                             |
| ----------------------------- | ------------------------------------------------- |
| Total sources processed       | 44 (36 interviews + 5 conferences + 3 prototypes) |
| Extraction documents created  | 26                                                |
| Aggregation documents created | 8                                                 |
| Draft section documents       | 3                                                 |
| Final report                  | 1                                                 |
| **Total documents generated** | **38**                                            |
| Sub-agents spawned            | ~35                                               |
| Parallel batch size           | 5                                                 |
| **Total processing time**     | **~2 hours**                                      |

Two hours to process 44 sources into a structured, quantitatively-grounded research report. Manual synthesis of comparable rigor would have required weeks.

---

## The Core Finding That Emerged

The systematic approach surfaced a finding that contradicted our initial hypothesis and would likely have been missed through intuitive synthesis:

**Production AI agents are 30-40% model capability and 60-70% system architecture, integration, and evaluation infrastructure.**

This finding did not come from any single interview or conference talk. It emerged from quantitative pattern analysis across all 26 extracted sources. When we looked at the data:

| Finding                               | Source Frequency    |
| ------------------------------------- | ------------------- |
| 30-40% model contribution (not 70%)   | 18/26 sources (69%) |
| 40-50% deployment time on integration | 15/26 sources (58%) |
| 80-90% framework abandonment rate     | 12/26 sources (46%) |
| 90% enterprise pilot failure rate     | 14/26 sources (54%) |

Eighteen out of twenty-six sources independently mentioned that model capability was not the primary bottleneck. This was not a single provocative quote that stuck in memory. It was a pattern spanning interviews with founders, conference presentations, and our own prototype experiences.

The methodology forced us to confront data that contradicted our starting hypothesis. We began the research believing model improvements would unlock agent potential. The evidence said otherwise.

---

## Lessons Learned

### What Worked Well

**Parallel sub-agent execution.** Batches of 5 maximized throughput while maintaining quality. Each sub-agent operated independently, preventing cascade failures or bottlenecks.

**Standardized extraction template.** Consistent structure across all sources enabled quantitative analysis. Without standardization, comparing a founder interview to a conference talk to prototype notes would have been impossible.

**Theme tagging system.** Predefined categories plus emergent theme identification created a flexible taxonomy. We captured what we expected to find AND what we did not expect.

**Two-phase independence.** Extracting before aggregating prevented confirmation bias. Patterns emerged from data, not from preconceived narratives.

**Explicit contradiction documentation.** Requiring sub-agents to document tensions between sources preserved nuance. Our findings include disagreements, not artificial consensus.

### What We Would Improve

**Earlier emergent theme formalization.** New themes should be added to the master taxonomy as soon as they appear, not just flagged for later review.

**Weighted source prioritization in drafting.** High-relevance extractions should receive more attention in final synthesis, with explicit quotas for top-tier sources.

**Better quote management.** Tracking which quotes have been used across documents would prevent repetition and ensure diversity of voices.

**More explicit timeline tracking.** Documenting exactly when each theme emerged or shifted would strengthen the evolution narrative.

---

## Conclusion: The Value of Systematic Rigor

The two-phase extraction and aggregation methodology transformed our research capability. What would have been weeks of manual synthesis completed in two hours. More importantly, systematic processing surfaced findings that intuitive analysis might have missed.

The 30-40% model / 60-70% architecture insight is the clearest example. It contradicted our initial hypothesis. It emerged from pattern analysis, not memorable anecdotes. And it became the central finding of our research, reshaping how we think about what unlocks AI agent potential.

Qualitative research does not have to be soft or subjective. With the right methodology, parallel execution, standardized extraction, and quantitative aggregation, interview insights can be as rigorous as experimental data. The key is building systems that prevent bias from entering the synthesis process.

For researchers tackling similar challenges, consider: Are you processing sources independently before synthesizing? Are you counting theme frequency, not just noting presence? Are you documenting contradictions, not just consensus? The answers to these questions determine whether your findings reflect the data or your assumptions.

Our methodology is not perfect. But it is reproducible, it scales, and it surfaces patterns that matter. That is what systematic research requires.

---

_Publication 25 of the AI Agents Research Series. Based on the GSBGEN 390 research project, Stanford Graduate School of Business, Autumn 2025._
