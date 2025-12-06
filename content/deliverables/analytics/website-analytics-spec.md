# Website Analytics Tracking Specification

## Analytics Platform

Recommended: Google Analytics 4 (GA4) or Plausible

## Events to Track

### Page Views

- Blog post views (by post)
- Series landing page views
- Homepage views

### Engagement Events

- Scroll depth (25%, 50%, 75%, 100%)
- Time on page
- External link clicks
- Internal navigation clicks

### Conversion Events

- Email signup (if applicable)
- LinkedIn follow click
- Contact form submissions

## Custom Dimensions

- Post category (theme, emergent, interview, etc.)
- Author
- Publication date

## UTM Parameters

- utm_source: linkedin, email, direct
- utm_medium: social, newsletter
- utm_campaign: ai-agents-research

## Dashboard Setup

| Metric            | Target | Alert Threshold |
| ----------------- | ------ | --------------- |
| Daily page views  | 100+   | <50             |
| Avg. time on page | 4+ min | <2 min          |
| Bounce rate       | <60%   | >75%            |

## Implementation Checklist

- [ ] Install analytics script
- [ ] Configure events
- [ ] Set up goals
- [ ] Create dashboard
