# Website Deployment Checklist

## Pre-Deployment

- [ ] All 25 blog posts ready
- [ ] All images created (from specs)
- [ ] Internal links fixed
- [ ] Invalid dates corrected
- [ ] Permissions confirmed for interview posts

## Deployment Steps

1. [ ] Copy blog posts to website content folder
2. [ ] Copy images to public folder
3. [ ] Run build process
4. [ ] Verify build succeeds
5. [ ] Deploy to staging
6. [ ] Test all pages load
7. [ ] Deploy to production

## SEO Redirect Configuration

```nginx
# Redirect configuration
# Add to nginx.conf or vercel.json

# Series landing page
/ai-agents-research -> /blog/ai-agents-research-series

# Potential URL variations
/ai-agents -> /blog/ai-agents-research-overview
```

## Post-Deployment Verification

- [ ] All 25 posts accessible
- [ ] Images loading correctly
- [ ] Internal links working
- [ ] Social sharing metadata working
- [ ] Analytics tracking active

## Rollback Plan

If issues found:

1. Revert to previous deployment
2. Fix identified issues
3. Re-deploy

## Sign-off

- [ ] Deployment complete
- [ ] All checks passed
- [ ] Ready for launch
