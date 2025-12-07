/**
 * MDX Components
 *
 * Custom React components for use in MDX blog posts.
 * These components enhance the reading experience with
 * rich, interactive content elements.
 */

// Callout - info, warning, success, error boxes
export { Callout } from './Callout'
export type { CalloutProps, CalloutType } from './Callout'

// CodeBlock - syntax highlighted code with copy button
export { CodeBlock } from './CodeBlock'
export type { CodeBlockProps } from './CodeBlock'

// Quote - styled blockquote with attribution
export { Quote } from './Quote'
export type { QuoteProps } from './Quote'

// Accordion - collapsible sections
export { Accordion, AccordionItem } from './Accordion'
export type { AccordionProps, AccordionItemProps } from './Accordion'

// Chart - bar, line, pie charts using Recharts
export { Chart } from './Chart'
export type { ChartProps, ChartType, ChartDataPoint } from './Chart'

// Import components for the mdxComponents map
import { Callout as CalloutComponent } from './Callout'
import { CodeBlock as CodeBlockComponent } from './CodeBlock'
import { Quote as QuoteComponent } from './Quote'
import { Accordion as AccordionComponent, AccordionItem as AccordionItemComponent } from './Accordion'
import { Chart as ChartComponent } from './Chart'

/**
 * MDX Components Map
 *
 * Use this object when configuring MDX rendering.
 * Pass to MDXRemote or your MDX configuration.
 *
 * Example:
 * ```tsx
 * import { mdxComponents } from '@/components/mdx'
 * <MDXRemote source={content} components={mdxComponents} />
 * ```
 */
export const mdxComponents = {
  Callout: CalloutComponent,
  CodeBlock: CodeBlockComponent,
  Quote: QuoteComponent,
  Accordion: AccordionComponent,
  AccordionItem: AccordionItemComponent,
  Chart: ChartComponent,
}

export default mdxComponents
