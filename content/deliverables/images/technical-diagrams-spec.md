# Technical Diagram Specifications

## Generated Images

| Diagram                        | Image                                                                                                               | File Path                                                                                     |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| 1. Research Methodology Flow   | ![Methodology Flow](generated-images/technical-diagrams/technical-diagram-01-methodology-flow-v1.png)               | `generated-images/technical-diagrams/technical-diagram-01-methodology-flow-v1.png`            |
| 2. Theme Weight Distribution   | ![Theme Weight](generated-images/technical-diagrams/technical-diagram-02-theme-weight-distribution-v1.png)          | `generated-images/technical-diagrams/technical-diagram-02-theme-weight-distribution-v1.png`   |
| 3. Framework Evolution Journey | ![Framework Evolution](generated-images/technical-diagrams/technical-diagram-03-framework-evolution-journey-v1.png) | `generated-images/technical-diagrams/technical-diagram-03-framework-evolution-journey-v1.png` |
| 4. Agent Success Attribution   | ![Success Attribution](generated-images/technical-diagrams/technical-diagram-04-agent-success-attribution-v1.png)   | `generated-images/technical-diagrams/technical-diagram-04-agent-success-attribution-v1.png`   |
| 5. Theme Evolution Matrix      | ![Theme Evolution](generated-images/technical-diagrams/technical-diagram-05-theme-evolution-matrix-v1.png)          | `generated-images/technical-diagrams/technical-diagram-05-theme-evolution-matrix-v1.png`      |
| 6. Critical Findings Dashboard | ![Critical Findings](generated-images/technical-diagrams/technical-diagram-06-critical-findings-dashboard-v1.png)   | `generated-images/technical-diagrams/technical-diagram-06-critical-findings-dashboard-v1.png` |

---

## Overview

This document specifies technical diagrams for the GSBGEN 390 AI Agents Research publications. These diagrams visualize the research methodology, data analysis, and key findings in formats suitable for academic papers, presentations, and technical blog posts.

---

## Diagram 1: Research Methodology Flow

### Purpose

Visualize the systematic two-phase extraction and aggregation process used to transform 44 raw sources into the final research report.

### Type

**Flowchart / Process Diagram**

### Elements

```
[44 Primary Sources]
    |
    v
+---+---+---+---+---+
| 36 Interviews | 5 Conferences | 3 Prototypes |
+---+---+---+---+---+
    |
    | Phase 1: Parallel Extraction
    | (Batches of 5 sub-agents)
    v
+---------------------------+
| 26 Extraction Documents   |
| - Standardized template   |
| - Theme tags applied      |
| - Relevance scores        |
+---------------------------+
    |
    | Phase 2: Aggregation
    v
+---------------------------+
| Theme Frequency Analysis  |
+---------------------------+
    |
    v
+---+---+---+---+---+---+
| 6 Theme Consolidations    |
+---+---+---+---+---+---+
    |
    v
+---------------------------+
| Evolution Narrative       |
+---------------------------+
    |
    | Phase 3: Report Drafting
    v
+---+---+---+
| Section A | Section B | Section C |
+---+---+---+
    |
    | Phase 4: Final Synthesis
    v
[Final Report: 2,800 words]
```

### Visual Specifications

| Property     | Value                                                    |
| ------------ | -------------------------------------------------------- |
| Dimensions   | 800 x 600 px (landscape)                                 |
| Orientation  | Top-to-bottom flow                                       |
| Color Scheme | Blue gradient for data flow, orange for processing nodes |
| Style        | Clean technical diagram with rounded rectangles          |

### Node Types

| Node Type        | Shape                 | Color                       | Border             |
| ---------------- | --------------------- | --------------------------- | ------------------ |
| Input Sources    | Rounded rectangle     | #EBF5FB (light blue)        | #3498DB (blue)     |
| Processing Steps | Rectangle             | #FEF9E7 (light amber)       | #E67E22 (orange)   |
| Output Documents | Rounded rectangle     | #E8F8F5 (light teal)        | #1ABC9C (teal)     |
| Final Output     | Rectangle with shadow | #8C1515 (Stanford Cardinal) | #6A0F0F (dark red) |

### Data Labels to Include

- "~35 sub-agents spawned"
- "~2 hours total processing"
- "38 documents generated"
- "Batches of 5 parallel workers"

### Annotations

- Arrow labels indicating phase transitions
- Small icons for document types (interview, conference, prototype)
- Processing time indicators at each phase

### Design Notes

- Use directional arrows to show data flow
- Group related elements with subtle background shading
- Include legend for node types
- Ensure text is readable at 50% zoom

---

## Diagram 2: Theme Weight Distribution

### Purpose

Visualize the theme frequency analysis showing occurrence rates and calculated weights across all 26 extraction documents.

### Type

**Horizontal Bar Chart with Dual Metrics**

### Data

| Theme                               | Occurrence | Occurrence % | Weight Score |
| ----------------------------------- | ---------- | ------------ | ------------ |
| System Integration                  | 24/26      | 92%          | 114.0        |
| Probabilistic Systems & Reliability | 22/26      | 85%          | 106.0        |
| Framework & Tooling Ecosystem       | 22/26      | 85%          | 103.0        |
| Enterprise Blockers & Governance    | 21/26      | 81%          | 98.0         |
| Context Management & Memory         | 18/26      | 69%          | 82.0         |
| Model Capabilities & Limitations    | 16/26      | 62%          | 72.0         |

### Visual Specifications

| Property         | Value                              |
| ---------------- | ---------------------------------- |
| Dimensions       | 900 x 500 px (landscape)           |
| Chart Type       | Horizontal grouped bar chart       |
| Primary Metric   | Occurrence percentage (bar length) |
| Secondary Metric | Weight score (label annotation)    |

### Color Coding

| Theme                 | Primary Color        | Rationale             |
| --------------------- | -------------------- | --------------------- |
| System Integration    | #E74C3C (red-orange) | Top priority, warning |
| Probabilistic Systems | #3498DB (blue)       | Testing, reliability  |
| Framework & Tooling   | #9B59B6 (purple)     | Developer tools       |
| Enterprise Blockers   | #E67E22 (orange)     | Business concerns     |
| Context Management    | #1ABC9C (teal)       | Data, memory          |
| Model Capabilities    | #2C3E50 (dark blue)  | AI/ML core            |

### Chart Elements

- Y-axis: Theme names (left-aligned, 14px)
- X-axis: Percentage scale (0% to 100%)
- Bar labels: Show both percentage and weight
- Grid lines: Subtle vertical lines at 25%, 50%, 75%, 100%

### Annotations

- Weight calculation formula: `Weight = Occurrence Count x Average Relevance Score`
- Data source note: "Analysis of 26 extraction documents"
- Highlight indicator for 90%+ threshold

### Visual Treatments

- Subtle gradient on bars (left to right, darker to lighter)
- Weight score displayed at end of each bar
- Stanford Cardinal accent on highest-weighted theme

---

## Diagram 3: Framework Evolution Journey

### Purpose

Visualize the 80-90% framework abandonment journey that teams experience when building production AI agents.

### Type

**Journey / Timeline Flow Diagram**

### Journey Stages

```
Stage 1: Initial Adoption
[Enthusiastic Adoption]
- "Frameworks promise rapid prototyping"
- "Built demo in 2 hours"
- Teams: 100%

    |
    v

Stage 2: Demo Success
[Promising Results]
- "Demo works great"
- "Impressed stakeholders"
- Teams: ~95%

    |
    v

Stage 3: Production Challenges
[Hitting Walls]
- "Debugging is a nightmare"
- "Can't customize behavior"
- "Integration pain"
- Teams: ~70%

    |
    v

Stage 4: The Decision Point
[Framework Limitations Exposed]
- "Abstractions hide failures"
- "Need control over prompts"
- "Evaluation requires visibility"
- Teams Split: Continue vs. Abandon

    |
    +----> Continue with Framework (10-20%)
    |           - Accept limitations
    |           - Build workarounds
    |           - Struggle with observability
    |
    +----> Abandon for Custom (80-90%)
                - "Worth the rebuild"
                - Thin wrapper approach
                - Full control over system
```

### Visual Specifications

| Property      | Value                                             |
| ------------- | ------------------------------------------------- |
| Dimensions    | 1000 x 700 px (landscape)                         |
| Orientation   | Left-to-right timeline with vertical split at end |
| Style         | Journey map with emotional arc                    |
| Funnel Effect | Narrowing path showing team attrition             |

### Stage Visual Design

| Stage                 | Width      | Color                 | Icon          |
| --------------------- | ---------- | --------------------- | ------------- |
| Initial Adoption      | 100% width | #27AE60 (green)       | Rocket        |
| Demo Success          | 95% width  | #2ECC71 (light green) | Checkmark     |
| Production Challenges | 70% width  | #F39C12 (yellow)      | Warning       |
| Decision Point        | Split      | #E74C3C (red)         | Fork in road  |
| Continue (10-20%)     | 15% width  | #95A5A6 (gray)        | Chain         |
| Abandon (80-90%)      | 85% width  | #3498DB (blue)        | Freedom/Build |

### Quote Callouts

**At Stage 3:**

> "50% of context window consumed by a popular AI agent framework's framing"

**At Stage 4:**

> "If the orchestration framework costs 50% of your budget, that's 50% of context wasted."

**At Final Split:**

> "80-90% of teams eventually abandon frameworks for custom solutions"
> Source: 12/26 sources (46%)

### Data Validation Badge

- "Finding validated across 12 of 26 independent sources"

### Design Notes

- Use funnel-style narrowing to show team dropout
- Emotional arc: optimism -> concern -> frustration -> resolution
- Include sentiment indicators (emoji-style or icons)
- Color transition from green (optimism) to red (challenge) to blue (solution)

---

## Diagram 4: Agent Success Attribution Split

### Purpose

Visualize the counter-intuitive finding that model capability contributes only 30-40% while architecture contributes 60-70% to agent success.

### Type

**Stacked Percentage Bar / Split Comparison**

### Data

| Component                         | Contribution | Source Validation |
| --------------------------------- | ------------ | ----------------- |
| System Architecture & Integration | 60-70%       | 18/26 sources     |
| Model Capability (LLM)            | 30-40%       | 18/26 sources     |

### Sub-Component Breakdown

**System Architecture (60-70%):**
| Sub-Component | Estimated % | Description |
|---------------|-------------|-------------|
| Integration Layer | 25% | MCP, APIs, tool calling, enterprise connectors |
| Evaluation Infrastructure | 20% | Testing, observability, debugging, monitoring |
| Context Management | 15% | Memory, RAG, context windows, data pipelines |
| Orchestration Framework | 10% | State machines, workflow coordination, error handling |

**Model Capability (30-40%):**
| Sub-Component | Estimated % | Description |
|---------------|-------------|-------------|
| Reasoning | 15% | Task decomposition, planning, decision-making |
| Generation | 10% | Output production, code writing, response synthesis |
| Understanding | 5-15% | Input parsing, context comprehension, tool selection |

### Visual Specifications

| Property       | Value                                      |
| -------------- | ------------------------------------------ |
| Dimensions     | 800 x 500 px (landscape)                   |
| Primary View   | Single horizontal stacked bar (100% width) |
| Secondary View | Exploded breakdown of each section         |

### Visual Layout

```
[Full Bar - 100% Width]
|<-------- 60-70% --------->|<-- 30-40% -->|
|   SYSTEM ARCHITECTURE     |    MODEL     |
|        (Orange)           |    (Blue)    |

[Exploded View Below]
Architecture:                Model:
+----------------+           +------------+
| Integration 25%|           | Reasoning  |
+----------------+           | 15%        |
| Evaluation 20% |           +------------+
+----------------+           | Generation |
| Context 15%    |           | 10%        |
+----------------+           +------------+
| Orchestration  |           | Understand |
| 10%            |           | 5-15%      |
+----------------+           +------------+
```

### Color Scheme

| Element                    | Color        | Hex     |
| -------------------------- | ------------ | ------- |
| System Architecture (main) | Orange/Amber | #E67E22 |
| Integration                | Dark Orange  | #D35400 |
| Evaluation                 | Orange       | #E67E22 |
| Context Management         | Light Orange | #F39C12 |
| Orchestration              | Pale Orange  | #FAD7A0 |
| Model Capability (main)    | Deep Blue    | #2980B9 |
| Reasoning                  | Dark Blue    | #1A5276 |
| Generation                 | Blue         | #2980B9 |
| Understanding              | Light Blue   | #5DADE2 |

### Key Insight Callout

> "Production AI agents are an engineering problem, not an AI problem."

### Quote Attribution

> "We found out actually model only maybe contributes 30 or 40% of the whole thing. And the framework, the whole system you build upon the model is much more important than the model itself."
> -- an AI autonomous agent company Fireside Conference

### Design Notes

- Use visual weight to emphasize the larger architecture portion
- Include tooltip-style annotations for sub-components
- Maintain consistent color family within each major section
- Add subtle texture/pattern difference between sections

---

## Diagram 5: Theme Evolution Matrix

### Purpose

Visualize how understanding of each theme evolved throughout the research process, showing which hypotheses grew, diminished, or remained stable.

### Type

**Matrix / Heatmap with Evolution Indicators**

### Data

| Theme                 | Initial Hypothesis    | Research Finding                   | Status     | Change |
| --------------------- | --------------------- | ---------------------------------- | ---------- | ------ |
| System Integration    | Major blocker         | THE dominant challenge (92%)       | GREW       | +++    |
| Model Capabilities    | Primary bottleneck    | 30-40% of success                  | DIMINISHED | ---    |
| Framework Ecosystem   | Needs maturation      | 80-90% abandon for custom          | GREW       | +++    |
| Enterprise Blockers   | Secondary concern     | Co-equal or primary blocker        | GREW       | ++     |
| Context Management    | Unsolved problem      | Architectural issue, not model     | STABLE     | =      |
| Probabilistic Systems | New approaches needed | Organizational + technical problem | STABLE     | =      |

### Visual Specifications

| Property        | Value                                        |
| --------------- | -------------------------------------------- | ---------------- | ----------- | ---------- | ----- |
| Dimensions      | 900 x 600 px (landscape)                     |
| Layout          | Horizontal timeline with vertical theme rows |
| Timeline Points | Pre-Research                                 | Early Interviews | Conferences | Prototypes | Final |

### Visual Elements

**Row Structure:**

```
[Theme Name] [Initial State] ----> [Evolution Line] ----> [Final State] [Status Badge]
```

**Evolution Indicators:**
| Status | Visual | Color |
|--------|--------|-------|
| GREW | Upward arrow, thickening line | #27AE60 (green) |
| DIMINISHED | Downward arrow, thinning line | #E74C3C (red) |
| STABLE | Horizontal arrow, consistent line | #3498DB (blue) |

**Timeline Markers:**

- Pre-Research (Initial Hypotheses)
- Phase 1: Early Interviews (Sources 1-10)
- Phase 2: Conference Insights
- Phase 3: Prototype Validation
- Phase 4: Later Interviews (Sources 20-26)
- Final Understanding

### Color Intensity

- Use gradient intensity to show confidence level
- Darker = higher confidence/more sources
- Lighter = lower confidence/fewer sources

### Annotations

- Source count at each evolution point
- Key pivot moments marked with callout
- Hypotheses invalidated marked with X

### Design Notes

- Horizontal time axis at top
- Theme names as row labels on left
- Status badges (GREW/DIMINISHED/STABLE) on right
- Include legend for visual encoding

---

## Diagram 6: Critical Findings Dashboard

### Purpose

Consolidate the six key quantitative findings into a single visual dashboard for quick reference and impact.

### Type

**Data Dashboard / Metric Cards**

### Data

| Finding                         | Value            | Source Frequency |
| ------------------------------- | ---------------- | ---------------- |
| Model Contribution              | 30-40% (not 70%) | 18/26 sources    |
| Deployment Time on Integration  | 40-50%           | 15/26 sources    |
| Framework Abandonment Rate      | 80-90%           | 12/26 sources    |
| Enterprise Pilot Failure Rate   | 90%              | 14/26 sources    |
| Context Window Utilization Rule | 40% max          | 8/26 sources     |
| MCP Tool Accuracy Threshold     | 25 tools max     | 6/26 sources     |

### Visual Specifications

| Property   | Value                     |
| ---------- | ------------------------- |
| Dimensions | 1200 x 800 px (landscape) |
| Layout     | 2x3 grid of metric cards  |
| Card Size  | 380 x 350 px each         |

### Card Design

```
+----------------------------------+
|  [Icon]                          |
|                                  |
|        30-40%                    |
|   (Large, bold number)           |
|                                  |
|   Model Contribution             |
|   (not 70% as expected)          |
|                                  |
|   [Progress bar: 18/26]          |
|   Validated by 18 sources        |
+----------------------------------+
```

### Card Color Coding

| Finding               | Card Color | Icon            |
| --------------------- | ---------- | --------------- |
| Model Contribution    | Deep Blue  | Brain/AI        |
| Integration Time      | Orange     | Clock/Gear      |
| Framework Abandonment | Purple     | Code/Exit       |
| Pilot Failure         | Red        | Warning/X       |
| Context Utilization   | Teal       | Document/Buffer |
| Tool Accuracy         | Green      | Tools/Checkmark |

### Visual Elements per Card

- Large percentage/number (48-72px bold)
- Finding title (18px medium)
- Context subtitle (14px regular)
- Source validation bar (progress indicator)
- Small icon representing the finding

### Dashboard Header

- Title: "Key Research Findings: AI Agents in Production"
- Subtitle: "Quantitative insights from 26 analyzed sources"
- Source attribution

### Design Notes

- Cards should have subtle shadows for depth
- Hover states if interactive
- Consistent typography across all cards
- Stanford Cardinal accent on validation badges

---

## Global Design Guidelines

### Typography

| Element     | Font Family                   | Weight  | Size Range |
| ----------- | ----------------------------- | ------- | ---------- |
| Titles      | Sans-serif (Inter, Helvetica) | Bold    | 24-48px    |
| Labels      | Sans-serif                    | Medium  | 14-18px    |
| Body        | Sans-serif                    | Regular | 12-16px    |
| Data Values | Sans-serif                    | Bold    | 18-72px    |
| Quotes      | Serif (Georgia, Times)        | Italic  | 14-20px    |

### Color Palette (Global)

| Purpose         | Color        | Hex     | Usage                  |
| --------------- | ------------ | ------- | ---------------------- |
| Primary Blue    | Deep Blue    | #2C3E50 | Text, headers          |
| Secondary Blue  | Medium Blue  | #3498DB | Data, links            |
| Accent Orange   | Warm Orange  | #E67E22 | Architecture elements  |
| Success Green   | Emerald      | #27AE60 | Positive indicators    |
| Warning Red     | Coral Red    | #E74C3C | Negative indicators    |
| Neutral Gray    | Slate        | #7F8C8D | Secondary text         |
| Background      | Off-White    | #F8F9FA | Canvas                 |
| Stanford Accent | Cardinal Red | #8C1515 | Institutional branding |

### Accessibility Requirements

- Minimum color contrast ratio: 4.5:1 for text
- All diagrams must include alt text descriptions
- Avoid relying solely on color to convey information
- Text must be readable at 50% zoom
- Provide colorblind-friendly alternatives

### Export Requirements

| Format | Use Case           | Resolution  |
| ------ | ------------------ | ----------- |
| PNG    | Web, presentations | 2x (retina) |
| SVG    | Scalable, print    | Vector      |
| PDF    | Archival, print    | 300 DPI     |

### File Naming Convention

```
technical-diagram-[number]-[short-name]-[version].png
Example: technical-diagram-01-methodology-flow-v1.png
```

---

## Implementation Checklist

### Pre-Production

- [ ] Review all data points against ProcessRecap.md
- [ ] Confirm color palette with brand guidelines
- [ ] Select typography that matches existing publications

### Production

- [ ] Create each diagram at specified dimensions
- [ ] Apply consistent styling across all diagrams
- [ ] Include all required annotations and labels
- [ ] Export in all required formats

### Quality Assurance

- [ ] Verify all data values are accurate
- [ ] Test readability at 50% and 200% zoom
- [ ] Validate color contrast ratios
- [ ] Check consistency across diagram set
- [ ] Prepare alt text for each diagram

### Delivery

- [ ] PNG exports (2x resolution)
- [ ] SVG exports (vector)
- [ ] PDF exports (archival)
- [ ] Alt text document
- [ ] Source files (Figma/Illustrator)

---

## Design Tools Recommended

| Tool              | Purpose             | Notes                          |
| ----------------- | ------------------- | ------------------------------ |
| Figma             | Primary design      | Collaborative, version control |
| Adobe Illustrator | Production export   | High-quality vectors           |
| Lucidchart        | Flowcharts          | Quick iterations               |
| Mermaid.js        | Code-based diagrams | Version-controlled diagrams    |
| Canva             | Quick mockups       | Fast prototyping               |

---

## Summary

| Diagram                        | Type           | Dimensions | Primary Data Source      |
| ------------------------------ | -------------- | ---------- | ------------------------ |
| 1. Research Methodology Flow   | Flowchart      | 800x600px  | ProcessRecap.md Overview |
| 2. Theme Weight Distribution   | Bar Chart      | 900x500px  | Theme Frequency Analysis |
| 3. Framework Evolution Journey | Journey Map    | 1000x700px | Evolution Narrative      |
| 4. Agent Success Attribution   | Stacked Bar    | 800x500px  | 70-30 Principle Finding  |
| 5. Theme Evolution Matrix      | Matrix/Heatmap | 900x600px  | Theme Evolution Table    |
| 6. Critical Findings Dashboard | Metric Cards   | 1200x800px | Critical Data Points     |

---

_Specification created: December 3, 2025_
_Project: GSBGEN 390 AI Agents Research Publishing_
_Authors: Torres & Bhende (MSx '26)_
_Reference Document: ProcessRecap.md_
