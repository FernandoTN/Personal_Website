#!/usr/bin/env node
/**
 * Generate placeholder SVG images for blog posts
 * Run: node scripts/generate-blog-placeholders.js
 */

const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, '../public/images/blog');

// Ensure directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Image configurations with categories and themes
const images = [
  // Anchor posts
  { name: 'ai-agents-anchor', title: 'Eight Pillars Framework', subtitle: 'AI Agents Research Series', category: 'ANCHOR', color1: '#8B5CF6', color2: '#06B6D4' },
  { name: 'ai-agents-research-cover', title: 'AI Agents Research', subtitle: '36 Expert Interviews | 5 Conferences | 3 Prototypes', category: 'ANCHOR', color1: '#8B5CF6', color2: '#06B6D4' },

  // Theme posts
  { name: 'system-integration-92-percent', title: 'The 92% Integration Problem', subtitle: 'System Integration as Primary Blocker', category: 'THEME', color1: '#EF4444', color2: '#F97316' },
  { name: 'context-management-cover', title: 'The 40% Context Rule', subtitle: 'Context Management Best Practices', category: 'THEME', color1: '#3B82F6', color2: '#06B6D4' },
  { name: 'framework-abandonment-cover', title: 'Framework Abandonment', subtitle: '80-90% Production Teams Rebuild', category: 'THEME', color1: '#F59E0B', color2: '#EF4444' },
  { name: 'demo-production-chasm-cover', title: 'Demo to Production Chasm', subtitle: 'Bridging the 90% Failure Gap', category: 'THEME', color1: '#EC4899', color2: '#8B5CF6' },
  { name: 'enterprise-blockers-cover', title: 'Enterprise Business Case', subtitle: 'ROI and Cost Predictability', category: 'THEME', color1: '#10B981', color2: '#3B82F6' },
  { name: 'coding-agent-exception-cover', title: 'The Coding Agent Exception', subtitle: 'Why Code Agents Succeed', category: 'THEME', color1: '#06B6D4', color2: '#8B5CF6' },
  { name: 'model-myth-cover', title: 'The Model Myth', subtitle: '30-40% Model Contribution Reality', category: 'THEME', color1: '#8B5CF6', color2: '#EC4899' },

  // Emergent insights
  { name: 'handoff-rate-metric', title: 'Handoff Rate Metric', subtitle: 'Measuring Agent Autonomy', category: 'EMERGENT', color1: '#14B8A6', color2: '#22D3EE' },
  { name: 'dual-memory-architecture', title: 'Dual Memory Architecture', subtitle: 'Short-term vs Long-term Memory', category: 'EMERGENT', color1: '#6366F1', color2: '#A855F7' },
  { name: 'mcp-tool-cliff', title: 'The MCP Tool Cliff', subtitle: '25 Tools = 30% Accuracy Drop', category: 'EMERGENT', color1: '#EF4444', color2: '#F97316' },
  { name: 'component-evaluation-cover', title: 'Component Evaluation', subtitle: 'Evaluating Agent Components', category: 'EMERGENT', color1: '#3B82F6', color2: '#10B981' },
  { name: 'evaluation-gap-cover', title: 'The Evaluation Gap', subtitle: 'Testing Probabilistic Systems', category: 'EMERGENT', color1: '#F59E0B', color2: '#EF4444' },

  // Practitioner interviews
  { name: 'practitioner-interview', title: 'Practitioner Interview', subtitle: 'Insights from the Field', category: 'PRACTITIONER', color1: '#10B981', color2: '#06B6D4' },
  { name: 'practitioner-interview-1', title: 'Practitioner Interview', subtitle: 'Enterprise AI Deployment Expert', category: 'PRACTITIONER', color1: '#10B981', color2: '#06B6D4' },
  { name: 'practitioner-interview-2-probabilistic-systems', title: 'Probabilistic Systems', subtitle: 'Autonomy and Trust in AI', category: 'PRACTITIONER', color1: '#8B5CF6', color2: '#10B981' },
  { name: 'practitioner-interview-3', title: 'Identity & Security', subtitle: 'AI Agent Authentication', category: 'PRACTITIONER', color1: '#3B82F6', color2: '#10B981' },
  { name: 'practitioner-interview-4', title: 'Multi-Agent Systems', subtitle: 'Framework Architecture', category: 'PRACTITIONER', color1: '#EC4899', color2: '#10B981' },
  { name: 'practitioner-interview-5-cover', title: 'AI Sales Intelligence', subtitle: 'Vertical AI Applications', category: 'PRACTITIONER', color1: '#F59E0B', color2: '#10B981' },

  // Prototype posts
  { name: 'shopping-agent-cover', title: 'Shopping Agent', subtitle: 'E-commerce Automation Prototype', category: 'PROTOTYPE', color1: '#06B6D4', color2: '#3B82F6' },
  { name: 'repo-patcher-cover', title: 'Repo Patcher', subtitle: 'State Machine Code Fixing', category: 'PROTOTYPE', color1: '#8B5CF6', color2: '#06B6D4' },
  { name: 'good-agents', title: 'Good Agents', subtitle: 'Multi-Agent Orchestration', category: 'PROTOTYPE', color1: '#10B981', color2: '#8B5CF6' },

  // Conference posts
  { name: 'autonomous-agent-fireside', title: 'Autonomous Agent Fireside', subtitle: 'Industry Leader Insights', category: 'CONFERENCE', color1: '#F59E0B', color2: '#EF4444' },
  { name: 'why-95-fail', title: 'Why 95% Fail', subtitle: 'Conference Key Takeaways', category: 'CONFERENCE', color1: '#EF4444', color2: '#F97316' },
  { name: 'production-summit', title: 'Production Summit', subtitle: 'Enterprise AI Deployment', category: 'CONFERENCE', color1: '#3B82F6', color2: '#8B5CF6' },

  // Mock post images (from BlogPostClient)
  { name: 'llm-cognitive-engine', title: 'LLM as Cognitive Engine', subtitle: 'Beyond Chat Completions', category: 'THEME', color1: '#8B5CF6', color2: '#EC4899' },
  { name: 'context-memory', title: 'Context & Memory', subtitle: 'The 40% Utilization Rule', category: 'THEME', color1: '#3B82F6', color2: '#06B6D4' },
  { name: 'system-integration', title: 'System Integration', subtitle: 'The 92% Blocker', category: 'THEME', color1: '#EF4444', color2: '#F97316' },
  { name: 'auth-identity', title: 'Authentication & Identity', subtitle: 'Agent Permissions', category: 'THEME', color1: '#10B981', color2: '#3B82F6' },
  { name: 'default-featured', title: 'AI Agents Research', subtitle: 'Stanford GSB Research Series', category: 'THEME', color1: '#8B5CF6', color2: '#06B6D4' },

  // Methodology
  { name: 'research-methodology-cover', title: 'Research Methodology', subtitle: 'How We Conducted This Study', category: 'METHODOLOGY', color1: '#6366F1', color2: '#8B5CF6' },
];

const categoryColors = {
  'ANCHOR': { bg: '#8B5CF6', text: '#A78BFA' },
  'THEME': { bg: '#3B82F6', text: '#60A5FA' },
  'EMERGENT': { bg: '#14B8A6', text: '#2DD4BF' },
  'PRACTITIONER': { bg: '#10B981', text: '#34D399' },
  'PROTOTYPE': { bg: '#06B6D4', text: '#22D3EE' },
  'CONFERENCE': { bg: '#F59E0B', text: '#FBBF24' },
  'METHODOLOGY': { bg: '#6366F1', text: '#818CF8' },
};

function generateSVG(config) {
  const { title, subtitle, category, color1, color2 } = config;
  const catColor = categoryColors[category] || categoryColors['THEME'];

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0f172a"/>
      <stop offset="100%" style="stop-color:#1e293b"/>
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:${color1}"/>
      <stop offset="100%" style="stop-color:${color2}"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <!-- Decorative elements -->
  <g transform="translate(600, 280)">
    <circle cx="0" cy="0" r="120" fill="none" stroke="url(#accent)" stroke-width="3" opacity="0.5"/>
    <circle cx="0" cy="0" r="180" fill="none" stroke="url(#accent)" stroke-width="2" opacity="0.3"/>
    <circle cx="0" cy="0" r="240" fill="none" stroke="url(#accent)" stroke-width="1" opacity="0.15"/>
    <circle cx="0" cy="0" r="60" fill="url(#accent)" opacity="0.8"/>
    <!-- Data points -->
    <circle cx="-100" cy="-100" r="12" fill="${color1}" opacity="0.6"/>
    <circle cx="120" cy="-80" r="10" fill="${color2}" opacity="0.6"/>
    <circle cx="-80" cy="110" r="14" fill="${color1}" opacity="0.6"/>
    <circle cx="100" cy="90" r="11" fill="${color2}" opacity="0.6"/>
    <circle cx="0" cy="-140" r="8" fill="${color1}" opacity="0.6"/>
    <circle cx="150" cy="20" r="9" fill="${color2}" opacity="0.6"/>
    <!-- Connection lines -->
    <line x1="-100" y1="-100" x2="0" y2="0" stroke="${color1}" stroke-width="1" opacity="0.25"/>
    <line x1="120" y1="-80" x2="0" y2="0" stroke="${color2}" stroke-width="1" opacity="0.25"/>
    <line x1="-80" y1="110" x2="0" y2="0" stroke="${color1}" stroke-width="1" opacity="0.25"/>
    <line x1="100" y1="90" x2="0" y2="0" stroke="${color2}" stroke-width="1" opacity="0.25"/>
  </g>
  <!-- Title -->
  <text x="600" y="520" font-family="system-ui, -apple-system, sans-serif" font-size="32" fill="#E2E8F0" text-anchor="middle" font-weight="600">${escapeXml(title)}</text>
  <text x="600" y="560" font-family="system-ui, -apple-system, sans-serif" font-size="18" fill="#94A3B8" text-anchor="middle">${escapeXml(subtitle)}</text>
  <!-- Category Badge -->
  <rect x="${600 - category.length * 5 - 20}" y="50" width="${category.length * 10 + 40}" height="32" rx="16" fill="${catColor.bg}" opacity="0.2"/>
  <text x="600" y="72" font-family="system-ui, -apple-system, sans-serif" font-size="14" fill="${catColor.text}" text-anchor="middle" font-weight="500">${category}</text>
</svg>`;
}

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Generate all images
console.log('Generating blog placeholder images...\n');

images.forEach(config => {
  const svg = generateSVG(config);

  // Write SVG file
  const svgPath = path.join(outputDir, `${config.name}.svg`);
  fs.writeFileSync(svgPath, svg);
  console.log(`  Created: ${config.name}.svg`);

  // Also write PNG-named version (SVG content, but browsers handle it)
  // For actual PNG conversion, you'd need sharp or similar
  // For now, we'll update the references to use SVG
});

console.log(`\n✅ Generated ${images.length} placeholder images in ${outputDir}`);
console.log('\nNote: Update blog post references to use .svg extension instead of .png');
