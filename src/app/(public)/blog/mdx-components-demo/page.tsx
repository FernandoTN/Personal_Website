'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Callout } from '@/components/mdx/Callout'
import { CodeBlock } from '@/components/mdx/CodeBlock'
import { Quote } from '@/components/mdx/Quote'
import { Accordion, AccordionItem } from '@/components/mdx/Accordion'
import { Chart } from '@/components/mdx/Chart'

/**
 * MDX Components Demo Page
 *
 * A test page to demonstrate all custom MDX components.
 * This page is used for testing Features 69-73.
 */
export default function MDXComponentsDemoPage() {
  // Sample chart data
  const barChartData = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 600 },
    { name: 'Apr', value: 450 },
    { name: 'May', value: 520 },
  ]

  const lineChartData = [
    { name: 'Week 1', value: 100 },
    { name: 'Week 2', value: 150 },
    { name: 'Week 3', value: 130 },
    { name: 'Week 4', value: 180 },
    { name: 'Week 5', value: 220 },
    { name: 'Week 6', value: 200 },
  ]

  const pieChartData = [
    { name: 'Desktop', value: 55 },
    { name: 'Mobile', value: 35 },
    { name: 'Tablet', value: 10 },
  ]

  return (
    <main className="min-h-screen bg-light-base dark:bg-dark-base">
      {/* Hero Section */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-light-icy-blue to-light-base dark:from-dark-deep-blue dark:to-dark-base">
        <div className="container-narrow">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 mb-6 text-sm font-medium text-text-secondary dark:text-text-dark-secondary hover:text-accent-primary transition-colors duration-200"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to Blog
            </Link>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary dark:text-text-dark-primary mb-4"
          >
            MDX Components Demo
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-text-secondary dark:text-text-dark-secondary"
          >
            Testing all custom MDX components: Callout, CodeBlock, Quote, Accordion, and Chart.
          </motion.p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 md:py-16">
        <div className="container-narrow">
          <article className="prose-custom">
            {/* Feature 69: Callout Component */}
            <h2 id="callout">Feature 69: Callout Component</h2>
            <p>Callouts are used to highlight important information with different severity levels.</p>

            <Callout type="info" title="Information">
              This is an informational callout. Use it to provide additional context or tips.
            </Callout>

            <Callout type="warning">
              This is a warning callout with the default title. Be careful about this important notice.
            </Callout>

            <Callout type="success" title="Great job!">
              This is a success callout. Your action completed successfully!
            </Callout>

            <Callout type="error" title="Something went wrong">
              This is an error callout. Please check the issue and try again.
            </Callout>

            {/* Feature 70: CodeBlock Component */}
            <h2 id="codeblock">Feature 70: CodeBlock Component</h2>
            <p>Code blocks display syntax-highlighted code with a copy button.</p>

            <CodeBlock language="typescript" filename="example.ts" showLineNumbers>
{`interface Agent {
  id: string;
  name: string;
  capabilities: string[];
}

function createAgent(config: Agent): Agent {
  console.log('Creating agent:', config.name);
  return {
    ...config,
    id: crypto.randomUUID(),
  };
}

const agent = createAgent({
  id: '',
  name: 'Research Assistant',
  capabilities: ['search', 'summarize', 'analyze'],
});`}
            </CodeBlock>

            <CodeBlock language="python" filename="agent.py">
{`from typing import List

class AIAgent:
    def __init__(self, name: str, capabilities: List[str]):
        self.name = name
        self.capabilities = capabilities

    def execute(self, task: str) -> str:
        return f"Executing {task} with {self.name}"

agent = AIAgent("Assistant", ["code", "analyze"])
result = agent.execute("research task")`}
            </CodeBlock>

            {/* Feature 71: Quote Component */}
            <h2 id="quote">Feature 71: Quote Component</h2>
            <p>Quotes display styled blockquotes with optional author attribution.</p>

            <Quote author="Steve Jobs" source="Stanford Commencement, 2005">
              Stay hungry, stay foolish. Your time is limited, so do not waste it living someone else's life.
            </Quote>

            <Quote author="Anonymous">
              The best way to predict the future is to invent it.
            </Quote>

            <Quote>
              This is a quote without attribution. Sometimes the wisdom stands on its own.
            </Quote>

            {/* Feature 72: Accordion Component */}
            <h2 id="accordion">Feature 72: Accordion Component</h2>
            <p>Accordions allow collapsible content sections that animate open and closed.</p>

            <Accordion>
              <AccordionItem title="What is an AI Agent?">
                An AI agent is an autonomous software entity that can perceive its environment,
                make decisions, and take actions to achieve specific goals. Unlike simple chatbots,
                agents can use tools, maintain memory, and execute multi-step tasks.
              </AccordionItem>
              <AccordionItem title="How do context windows work?" defaultOpen>
                Context windows define the amount of text an LLM can process in a single request.
                Modern models like GPT-4 have windows of 128K tokens, but our research shows that
                keeping utilization below 40% maintains optimal performance.
              </AccordionItem>
              <AccordionItem title="What is the 30-40% model contribution finding?">
                Our research discovered that model capability only contributes 30-40% to agent success.
                The remaining 60-70% comes from framework architecture, system integration, evaluation
                infrastructure, and business case clarity.
              </AccordionItem>
            </Accordion>

            {/* Feature 73: Chart Component */}
            <h2 id="chart">Feature 73: Chart Component</h2>
            <p>Charts visualize data using bar, line, or pie chart formats.</p>

            <h3>Bar Chart</h3>
            <Chart
              type="bar"
              title="Monthly Revenue ($K)"
              data={barChartData}
            />

            <h3>Line Chart</h3>
            <Chart
              type="line"
              title="Weekly User Growth"
              data={lineChartData}
            />

            <h3>Pie Chart</h3>
            <Chart
              type="pie"
              title="Traffic by Device"
              data={pieChartData}
            />

            {/* Summary */}
            <h2 id="summary">Summary</h2>
            <p>
              All five MDX components are now implemented and working:
            </p>
            <ul>
              <li><strong>Callout</strong> - info, warning, success, error variants with icons</li>
              <li><strong>CodeBlock</strong> - syntax highlighting, copy button, line numbers</li>
              <li><strong>Quote</strong> - styled blockquote with author/source attribution</li>
              <li><strong>Accordion</strong> - animated collapsible sections</li>
              <li><strong>Chart</strong> - bar, line, and pie charts using Recharts</li>
            </ul>
          </article>
        </div>
      </section>
    </main>
  )
}
