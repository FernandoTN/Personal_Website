# Broken Link Monitoring Process

## Monitoring Tools

1. **Automated:**
   - Google Search Console (free)
   - Screaming Frog (manual scans)
   - LinkChecker (GitHub Actions)

2. **Manual:**
   - Monthly spot checks
   - User-reported issues

## Monitoring Schedule

| Frequency | Action                      | Tool           |
| --------- | --------------------------- | -------------- |
| Weekly    | Check Search Console alerts | GSC            |
| Monthly   | Full site scan              | Screaming Frog |
| Quarterly | Manual spot check           | Browser        |

## Link Categories to Monitor

1. **Internal links** - Between blog posts
2. **External links** - To other sites
3. **Image paths** - To /images/
4. **Author links** - LinkedIn, email

## Response Protocol

### Broken Internal Link

1. Identify correct destination
2. Update link immediately
3. Log change

### Broken External Link

1. Find updated URL if available
2. Find alternative source
3. Remove if no replacement
4. Add [archived] note if using Wayback

## Alert Template

When broken link found:

- Post affected: [filename]
- Link text: [anchor text]
- URL: [broken URL]
- Fix applied: [new URL or removed]
- Date: [date]

## Prevention

- Prefer linking to stable URLs
- Use relative links internally
- Avoid deep links to third-party docs
