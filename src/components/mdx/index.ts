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
  Callout: require('./Callout').Callout,
  CodeBlock: require('./CodeBlock').CodeBlock,
  Quote: require('./Quote').Quote,
  Accordion: require('./Accordion').Accordion,
  AccordionItem: require('./Accordion').AccordionItem,
  Chart: require('./Chart').Chart,
}

export default mdxComponents
