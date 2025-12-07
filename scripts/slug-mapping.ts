// MDX filename to database slug mapping
// This maps the MDX filenames to the slugs used in the database

export const MDX_TO_SLUG_MAP: Record<string, string> = {
  '2025-12-ai-agents-research-overview': 'what-is-needed-to-unlock-ai-agents',
  '2025-12-coding-agent-exception': 'llm-cognitive-engine',
  '2025-12-40-percent-context-rule': 'context-memory-foundations',
  '2025-12-system-integration-92-percent': 'system-integration-challenges',
  '2025-12-okta-interview': 'authentication-identity',
  '2025-12-enterprise-business-case': 'trust-governance-guardrails',
  '2025-12-demo-production-chasm': 'emergent-behaviors',
  '2025-12-model-myth': 'cost-management-strategies',
  '2025-12-evaluation-gap': 'agent-evaluations',
  '2025-12-mcp-tool-cliff': 'monitoring-telemetry',
  '2025-12-handoff-rate-metric': 'practitioner-pharma-insights',
  '2025-12-component-evaluation': 'practitioner-supply-chain',
  '2025-12-dual-memory-architecture': 'emergent-reasoning-patterns',
  '2025-12-qurrent-interview': 'practitioner-customer-service',
  '2025-12-sybill-interview': 'practitioner-code-assistants',
  '2025-12-crewai-interview': 'prototype-rag-agent',
  '2025-12-autonomy-interview': 'prototype-multi-agent',
  '2025-12-framework-abandonment': 'emergent-tool-use',
  '2025-12-shopping-agent': 'prototype-voice-agent',
  '2025-12-repo-patcher': 'practitioner-data-analysis',
  '2025-12-good-agents': 'conference-neurips-insights',
  '2025-12-manus-fireside': 'conference-icml-trends',
  '2025-12-why-95-fail': 'conference-stanford-ai',
  '2025-12-production-summit': 'methodology-eight-pillars',
  '2025-12-research-methodology': 'series-conclusion',
}

// Reverse mapping: database slug to MDX filename
export const SLUG_TO_MDX_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(MDX_TO_SLUG_MAP).map(([mdx, slug]) => [slug, mdx])
)

// Get MDX filename from database slug
export function getMdxFilename(slug: string): string | undefined {
  return SLUG_TO_MDX_MAP[slug]
}

// Get database slug from MDX filename (without extension)
export function getSlugFromMdx(mdxFilename: string): string | undefined {
  // Remove .mdx extension if present
  const baseName = mdxFilename.replace(/\.mdx$/, '')
  return MDX_TO_SLUG_MAP[baseName]
}
