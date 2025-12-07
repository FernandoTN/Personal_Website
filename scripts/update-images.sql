-- Update all 25 AI Agents series posts with correct featured images

-- Post 1: Anchor (already done)

-- Posts 2-7: Theme Deep Dives
UPDATE posts SET featured_image = '/images/blog/coding-agent-exception-cover.png' WHERE slug = 'llm-cognitive-engine';
UPDATE posts SET featured_image = '/images/blog/context-management-cover.png' WHERE slug = 'context-memory-foundations';
UPDATE posts SET featured_image = '/images/blog/system-integration-92-percent.png' WHERE slug = 'system-integration-challenges';
UPDATE posts SET featured_image = '/images/blog/framework-abandonment-cover.png' WHERE slug = 'authentication-identity';
UPDATE posts SET featured_image = '/images/blog/enterprise-blockers-cover.png' WHERE slug = 'trust-governance-guardrails';
UPDATE posts SET featured_image = '/images/blog/demo-production-chasm-cover.png' WHERE slug = 'emergent-behaviors';

-- Posts 8-13: Emergent Insights
UPDATE posts SET featured_image = '/images/blog/model-myth-cover.png' WHERE slug = 'cost-management-strategies';
UPDATE posts SET featured_image = '/images/blog/dual-memory-architecture.png' WHERE slug = 'agent-evaluations';
UPDATE posts SET featured_image = '/images/blog/mcp-tool-cliff.png' WHERE slug = 'monitoring-telemetry';
UPDATE posts SET featured_image = '/images/blog/handoff-rate-metric.png' WHERE slug = 'practitioner-pharma-insights';
UPDATE posts SET featured_image = '/images/blog/component-evaluation-cover.png' WHERE slug = 'practitioner-supply-chain';
UPDATE posts SET featured_image = '/images/blog/evaluation-gap-cover.png' WHERE slug = 'emergent-reasoning-patterns';

-- Posts 14-18: Practitioner Perspectives
UPDATE posts SET featured_image = '/images/blog/practitioner-interview.png' WHERE slug = 'practitioner-customer-service';
UPDATE posts SET featured_image = '/images/blog/practitioner-interview-2-probabilistic-systems.png' WHERE slug = 'practitioner-code-assistants';
UPDATE posts SET featured_image = '/images/blog/practitioner-interview-3.png' WHERE slug = 'prototype-rag-agent';
UPDATE posts SET featured_image = '/images/blog/practitioner-interview-4.png' WHERE slug = 'prototype-multi-agent';
UPDATE posts SET featured_image = '/images/blog/practitioner-interview-5-cover.png' WHERE slug = 'emergent-tool-use';

-- Posts 19-21: Prototype Learnings
UPDATE posts SET featured_image = '/images/blog/shopping-agent-cover.png' WHERE slug = 'prototype-voice-agent';
UPDATE posts SET featured_image = '/images/blog/repo-patcher-cover.png' WHERE slug = 'practitioner-data-analysis';
UPDATE posts SET featured_image = '/images/blog/good-agents.png' WHERE slug = 'conference-neurips-insights';

-- Posts 22-24: Conference Insights
UPDATE posts SET featured_image = '/images/blog/autonomous-agent-fireside.png' WHERE slug = 'conference-icml-trends';
UPDATE posts SET featured_image = '/images/blog/why-95-fail.png' WHERE slug = 'conference-stanford-ai';
UPDATE posts SET featured_image = '/images/blog/production-summit.png' WHERE slug = 'methodology-eight-pillars';

-- Post 25: Methodology
UPDATE posts SET featured_image = '/images/blog/research-methodology-cover.png' WHERE slug = 'series-conclusion';
