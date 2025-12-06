# LinkedIn Post Template

This template provides a standardized format for creating LinkedIn posts that accompany blog publications in the AI Agents Research series.

---

## Character Count Guidelines

**Target**: Keep posts under 3,000 characters total

- Hook: 50-80 characters
- Context: 150-250 characters
- Key Insight: 200-400 characters
- Bullet Points: 300-500 characters (total)
- CTA: 80-150 characters
- Engagement Prompt: 50-100 characters
- Hashtags: ~70 characters

**LinkedIn Algorithm Notes**:

- First 2-3 lines appear before "see more" - make them count
- Posts with 3+ lines of whitespace perform better
- Bullet points increase engagement
- Questions at the end boost comments
- Posts between 1,200-1,500 characters tend to perform best for reach
- Native posting (not links in first comment) gets better initial distribution

---

## Template Structure

```markdown
[HOOK - Pattern interrupt or surprising statistic, 1 line]

[CONTEXT - Brief setup of the problem/question, 2-3 lines]

[KEY INSIGHT - The main finding, formatted for impact, 3-5 lines]

Here's what we discovered:

[BULLET POINTS - 3-4 key takeaways]

- Takeaway 1
- Takeaway 2
- Takeaway 3
- Takeaway 4

[CTA - Call to action with link, 1-2 lines]

Full breakdown in my latest post: [LINK]

[ENGAGEMENT PROMPT - Question to encourage comments, 1 line]

What's been your experience with [topic]?

---

[HASHTAGS - 3-5 relevant hashtags]
#AIAgents #EnterpriseAI #LLMs #TechLeadership #ProductionAI
```

---

## Section-by-Section Guidelines

### 1. Hook Section (Pattern Interrupt or Statistic)

The hook must stop the scroll. Use one of these patterns:

**Statistic Hook** (Most effective for this research):

- "92% of AI agent deployments struggle with the same problem."
- "90% of enterprise AI pilots never reach production."
- "80-90% of teams abandon their initial framework choice."

**Contrarian Hook**:

- "Everyone's focused on model capabilities. They're looking in the wrong place."
- "The AI model isn't the bottleneck. Here's what is."

**Question Hook**:

- "What's the #1 reason AI agents fail in production?"
- "Why do demos work but deployments don't?"

**Pattern Interrupt**:

- "Stop building AI agents. Start building integration pipelines."
- "Your context window isn't the problem. Your context strategy is."

### 2. Context Section (2-3 Lines)

Establish credibility and frame the problem:

- Reference the research scope (36 interviews, 5 conferences, 3 prototypes)
- Identify who experiences this problem
- Create tension between expectation and reality

**Example**:

```
After interviewing 36 experts building production AI agents, we found the #1
challenge isn't model capability or context windows.

It's system integration.
```

### 3. Key Insight Section (3-5 Lines)

Deliver the core finding with impact:

- State the main insight clearly
- Use line breaks for emphasis
- Include a memorable data point if available
- Make it standalone (someone should understand even if they don't read further)

**Example**:

```
The bottleneck isn't AI intelligence—it's the mundane work of connecting
heterogeneous enterprise systems.

Models contribute only 30-40% to agent success.
The other 60-70%? Architecture and integration.
```

### 4. Bullet Points Section (3-4 Takeaways)

Use bullet points (unicode bullet character or dashes) for scannability:

- Lead with the most surprising finding
- Include specific numbers when available
- Keep each bullet to one line
- Make bullets independently quotable

**Example**:

```
Here's what the data shows:

- 40-50% of deployment time is spent on integration (not AI work)
- MCP accuracy drops to 30% beyond 25 tools
- Custom integration is treated as competitive moat, not problem to solve
- SAP, Salesforce, core banking systems "never talked to each other"
```

### 5. Call-to-Action with Link Placeholder

Drive traffic to the full blog post:

**Formats**:

- "Full breakdown in my latest post: [LINK]"
- "I break down all the findings here: [LINK]"
- "Deep dive with practitioner quotes: [LINK]"
- "Read the complete analysis: [LINK]"

**Note**: Replace [LINK] with the actual blog post URL before publishing:

- Format: https://fernandotorres.io/blog/[slug]

### 6. Engagement Prompt Question

End with a question that invites comments:

**Question Types**:

- Experience-based: "What integration challenges have you faced deploying AI agents?"
- Opinion-based: "Do you agree that frameworks create more problems than they solve?"
- Situational: "Has your team had to rebuild after a framework switch?"

**Tips**:

- Make the question easy to answer
- Avoid yes/no questions
- Connect to shared pain points
- Be genuinely curious

### 7. Hashtag Section

Standard hashtags for this series:

```
#AIAgents #EnterpriseAI #LLMs #TechLeadership #ProductionAI
```

**Additional hashtags by topic** (use 1-2 alongside the standard set):

- System Integration: #SystemIntegration #APIDevelopment
- Context Management: #RAG #ContextWindows #Memory
- Frameworks: #a popular AI agent framework #LangGraph #Frameworks
- Enterprise: #DigitalTransformation #CTO
- Evaluation: #MLOps #AIOps #Testing
- Coding Agents: #DeveloperTools #CodingAgents #Cursor

---

## Example LinkedIn Post (Publication 2: System Integration)

```
92% of AI agent deployments struggle with the same problem.

And it's not what you think.

After interviewing 36 experts building production AI agents, we found the #1
challenge isn't model capability or context windows.

It's system integration.

Here's what the data shows:

- 40-50% of deployment time is spent on integration (not AI work)
- MCP accuracy drops to 30% beyond 25 tools
- Custom integration is treated as competitive moat, not problem to solve
- SAP, Salesforce, core banking systems "never talked to each other"

The bottleneck isn't AI intelligence—it's the mundane work of connecting
heterogeneous enterprise systems.

Full breakdown with quotes from practitioners: [LINK]

What integration challenges have you faced deploying AI agents?

#AIAgents #EnterpriseAI #SystemIntegration #LLMs #ProductionAI
```

---

## Quality Checklist

Before posting, verify:

- [ ] Hook appears fully above the "see more" fold (first 2-3 lines)
- [ ] Total character count is under 3,000
- [ ] At least one specific data point or statistic included
- [ ] Bullet points are scannable and quotable
- [ ] Link placeholder replaced with actual URL
- [ ] Engagement question is open-ended (not yes/no)
- [ ] Standard hashtags included
- [ ] No broken lines or formatting issues
- [ ] Reviewed for typos

---

## LinkedIn Algorithm Optimization Tips

1. **Post timing**: 9-11am PST on weekdays (Tues-Thurs optimal)
2. **Dwell time**: Use line breaks and whitespace to slow scrolling
3. **Early engagement**: Respond to comments within first 60 minutes
4. **No external links in first post**: Consider adding link in first comment for better reach
5. **Visual elements**: Consider adding an image (cover graphic or data visualization)
6. **Profile activity**: Engage with others' posts before and after publishing

---

## File Naming Convention

Save LinkedIn posts in `/publishing/deliverables/linkedin-posts/` using:

```
[XX]-[topic-slug].md
```

Examples:

- `01-anchor-post.md`
- `02-system-integration.md`
- `03-context-management.md`
- `04-framework-ecosystem.md`

---

## Reference: Key Statistics for Hooks

| Statistic                           | Source                                  | Best For              |
| ----------------------------------- | --------------------------------------- | --------------------- |
| 92% system integration challenges   | Theme_Frequency_Analysis                | Publication 2         |
| 90% pilot failure rate              | an enterprise AI deployment expert      | Publications 1, 5, 14 |
| 80-90% framework abandonment        | a consulting firm practitioner          | Publication 4         |
| 40% context utilization rule        | Production Agents Summit                | Publications 3, 24    |
| 30-40% model contribution           | an AI autonomous agent company Fireside | Publications 8, 22    |
| 25-tool MCP accuracy cliff          | CC (an AI infrastructure company)       | Publications 11       |
| 3-4x productivity for coding agents | Multiple sources                        | Publication 7         |

---

_Template version 1.0 - AI Agents Research Publishing Project_
