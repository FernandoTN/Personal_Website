# AI Agents Research Publication - Website Implementation Specification

**Document Version:** 1.0
**Created:** December 5, 2025
**Author:** Fernando Torres (MSx '26)
**Project:** Stanford GSB GSBGEN 390 - Individual Research

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Objectives & Requirements](#2-objectives--requirements)
3. [Technical Architecture](#3-technical-architecture)
4. [Content Structure](#4-content-structure)
5. [Auto-Reveal Scheduling System](#5-auto-reveal-scheduling-system)
6. [Admin Dashboard](#6-admin-dashboard)
7. [LinkedIn Integration](#7-linkedin-integration)
8. [Analytics System](#8-analytics-system)
9. [Final Report Showcase](#9-final-report-showcase)
10. [Publication Calendar](#10-publication-calendar)
11. [File Structure](#11-file-structure)
12. [Data Models](#12-data-models)
13. [API Specifications](#13-api-specifications)
14. [Implementation Phases](#14-implementation-phases)
15. [Deployment & CI/CD](#15-deployment--cicd)
16. [Security Considerations](#16-security-considerations)

---

## 1. Executive Summary

### Project Overview

Transform the AI Agents Research publication series (25 blog posts, 25 LinkedIn posts, 35 images, and the Final Report) into a fully-featured website section with:

- **Scheduled auto-reveal** of posts starting December 8, 2025
- **Admin dashboard** for content management and LinkedIn posting
- **LinkedIn integration** with both auto-posting and manual copy-paste
- **Analytics dashboard** for traffic visualization
- **Final Report showcase** as the research centerpiece

### Current Tech Stack

| Component       | Technology                   |
| --------------- | ---------------------------- |
| Framework       | Next.js 14 (App Router)      |
| Language        | TypeScript                   |
| Content         | Contentlayer + MDX           |
| Styling         | Tailwind CSS                 |
| Hosting         | GitHub Pages (static export) |
| Package Manager | pnpm                         |

### Constraints & Solutions

| Constraint                 | Solution                                  |
| -------------------------- | ----------------------------------------- |
| Static hosting (no server) | Cloudflare Workers for LinkedIn API       |
| No database                | JSON files + localStorage for admin state |
| Scheduled publishing       | GitHub Actions scheduled rebuilds         |
| Authentication             | Environment variable + httpOnly cookie    |

---

## 2. Objectives & Requirements

### Primary Objectives

1. **Content Publishing**: Deploy 25 blog posts with scheduled release dates
2. **Auto-Reveal**: Posts automatically become visible on their scheduled date
3. **LinkedIn Management**: Admin interface for LinkedIn posting (auto + manual)
4. **Analytics**: Real-time traffic visualization for all publications
5. **Final Report**: Dedicated showcase for the comprehensive research report

### Functional Requirements

#### FR-1: Blog Post Management

- [ ] Display posts filtered by publish date (future posts hidden from public)
- [ ] Admin view shows all posts with publish status
- [ ] Each post links to its corresponding LinkedIn post
- [ ] Series navigation between related posts

#### FR-2: Auto-Reveal System

- [ ] Posts automatically visible when `publishedAt >= currentDate`
- [ ] Daily GitHub Actions rebuild to update visibility
- [ ] Client-side date check as fallback
- [ ] Preview mode for admin to see unpublished posts

#### FR-3: Admin Dashboard

- [ ] Password-protected admin route (`/admin`)
- [ ] Publication calendar with status indicators
- [ ] LinkedIn post preview with copy buttons
- [ ] "Already Scheduled in LinkedIn" checkbox per post
- [ ] Auto-post trigger button with confirmation
- [ ] Analytics overview

#### FR-4: LinkedIn Integration

- [ ] OAuth 2.0 flow for LinkedIn API access
- [ ] Auto-post functionality with image attachment
- [ ] Manual mode with formatted copy-paste content
- [ ] Scheduling status tracker
- [ ] "Already Scheduled" checkbox to prevent duplicate posts

#### FR-5: Analytics Dashboard

- [ ] Page views per post
- [ ] Traffic over time (daily/weekly/monthly)
- [ ] Referrer breakdown
- [ ] Reading engagement metrics
- [ ] Export capability

#### FR-6: Final Report

- [ ] Dedicated `/research` page for full report
- [ ] Table of contents navigation
- [ ] PDF download option
- [ ] Key statistics highlight section

### Non-Functional Requirements

- **Performance**: < 3s initial page load
- **SEO**: Full meta tags, structured data, sitemap
- **Accessibility**: WCAG 2.1 AA compliance
- **Mobile**: Fully responsive design
- **Security**: Admin routes protected, API keys secured

---

## 3. Technical Architecture

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         GitHub Repository                           │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  /content/blog/*.mdx      (25 blog posts)                    │   │
│  │  /content/research/*.mdx  (Final Report)                     │   │
│  │  /data/linkedin-posts.json (LinkedIn content)                │   │
│  │  /data/publication-calendar.json (Schedule)                  │   │
│  │  /public/images/blog/*    (35 images)                        │   │
│  └─────────────────────────────────────────────────────────────┘   │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    GitHub Actions (CI/CD)                           │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  • Scheduled rebuild (daily 6:00 AM PST)                     │   │
│  │  • Build filtering based on publishedAt date                 │   │
│  │  • Deploy to GitHub Pages                                    │   │
│  └─────────────────────────────────────────────────────────────┘   │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    GitHub Pages (Static Host)                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  fernandotorres.io                                           │   │
│  │  ├── /blog                    (Public blog listing)          │   │
│  │  ├── /blog/[slug]             (Individual posts)             │   │
│  │  ├── /research                (Final Report showcase)        │   │
│  │  ├── /admin                   (Admin dashboard)              │   │
│  │  └── /admin/linkedin          (LinkedIn management)          │   │
│  └─────────────────────────────────────────────────────────────┘   │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                 Cloudflare Workers (Serverless)                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  api.fernandotorres.io                                       │   │
│  │  ├── /api/linkedin/auth       (OAuth flow)                   │   │
│  │  ├── /api/linkedin/post       (Create post)                  │   │
│  │  ├── /api/linkedin/schedule   (Schedule post)                │   │
│  │  └── /api/analytics           (Analytics proxy)              │   │
│  └─────────────────────────────────────────────────────────────┘   │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      External Services                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │  LinkedIn    │  │  Plausible   │  │  Cloudflare  │              │
│  │  API         │  │  Analytics   │  │  KV Storage  │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
└─────────────────────────────────────────────────────────────────────┘
```

### Technology Additions

| Component      | Technology          | Purpose                              |
| -------------- | ------------------- | ------------------------------------ |
| Serverless API | Cloudflare Workers  | LinkedIn OAuth, API proxy            |
| Analytics      | Plausible Analytics | Privacy-friendly, self-hosted option |
| State Storage  | Cloudflare KV       | LinkedIn tokens, posting status      |
| Scheduled Jobs | GitHub Actions      | Daily rebuild for auto-reveal        |

---

## 4. Content Structure

### Blog Posts (25 total)

All MDX files located in `/content/blog/` with Contentlayer schema.

#### Enhanced Contentlayer Schema

```javascript
// contentlayer.config.js - Updated Post schema
export const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: `blog/**/*.mdx`,
  contentType: 'mdx',
  fields: {
    // Existing fields
    title: { type: 'string', required: true },
    summary: { type: 'string', required: true },
    publishedAt: { type: 'date', required: true },
    tags: { type: 'list', of: { type: 'string' }, default: [] },
    image: { type: 'string' },
    author: { type: 'string', default: 'Fernando Torres' },
    featured: { type: 'boolean', default: false },

    // New fields for AI Agents series
    seriesOrder: {
      type: 'number',
      description: 'Position in publication series (1-25)',
    },
    category: {
      type: 'enum',
      options: [
        'anchor',
        'theme',
        'emergent',
        'practitioner',
        'prototype',
        'conference',
        'methodology',
      ],
      description: 'Publication category',
    },
    linkedinPostId: {
      type: 'string',
      description: 'Reference to LinkedIn post',
    },
    linkedinScheduled: { type: 'boolean', default: false },
    linkedinPosted: { type: 'boolean', default: false },
    linkedinPostedAt: { type: 'date' },
    requiresPermission: { type: 'boolean', default: false },
    permissionGranted: { type: 'boolean', default: false },
  },
  computedFields: {
    // ... existing computed fields
    isPublished: {
      type: 'boolean',
      resolve: (doc) => new Date(doc.publishedAt) <= new Date(),
    },
    daysUntilPublish: {
      type: 'number',
      resolve: (doc) => {
        const diff = new Date(doc.publishedAt).getTime() - new Date().getTime();
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
      },
    },
  },
}));
```

### LinkedIn Posts Data

```json
// /data/linkedin-posts.json
{
  "posts": [
    {
      "id": "linkedin-01",
      "blogPostSlug": "ai-agents-research-overview",
      "seriesOrder": 1,
      "title": "Anchor Post",
      "content": "90% of AI agent pilots fail to reach production...",
      "hashtags": [
        "#AIAgents",
        "#EnterpriseAI",
        "#LLMs",
        "#ProductionAI",
        "#StanfordGSB"
      ],
      "scheduledDate": "2025-12-08",
      "scheduledTime": "09:00",
      "timezone": "America/Los_Angeles",
      "imageFile": "anchor/anchor-cover.png",
      "status": "pending",
      "manuallyScheduled": false,
      "linkedinPostUrl": null,
      "postedAt": null
    }
    // ... 24 more posts
  ]
}
```

### Publication Calendar Data

```json
// /data/publication-calendar.json
{
  "series": {
    "name": "AI Agents Research Publication Series",
    "startDate": "2025-12-08",
    "endDate": "2025-02-13",
    "totalWeeks": 10,
    "totalPosts": 25
  },
  "schedule": [
    {
      "week": 1,
      "theme": "Launch Week",
      "dates": "Dec 8-12, 2025",
      "posts": [
        {
          "order": 1,
          "date": "2025-12-08",
          "day": "Mon",
          "slug": "ai-agents-research-overview"
        },
        {
          "order": 2,
          "date": "2025-12-10",
          "day": "Wed",
          "slug": "system-integration-92-percent"
        },
        {
          "order": 3,
          "date": "2025-12-12",
          "day": "Fri",
          "slug": "40-percent-context-rule"
        }
      ]
    }
    // ... weeks 2-10
  ]
}
```

---

## 5. Auto-Reveal Scheduling System

### Strategy: Hybrid Approach

Combine build-time filtering with client-side verification for reliable auto-reveal.

### Build-Time Filtering (Primary)

```typescript
// lib/posts.ts
import { allPosts } from 'contentlayer/generated';

export function getPublishedPosts() {
  const now = new Date();
  return allPosts
    .filter((post) => new Date(post.publishedAt) <= now)
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
}

export function getAllPostsForAdmin() {
  return allPosts.sort(
    (a, b) =>
      new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
  );
}

export function getUpcomingPosts() {
  const now = new Date();
  return allPosts
    .filter((post) => new Date(post.publishedAt) > now)
    .sort(
      (a, b) =>
        new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
    );
}
```

### GitHub Actions Scheduled Rebuild

```yaml
# .github/workflows/scheduled-deploy.yml
name: Scheduled Deploy

on:
  schedule:
    # Run daily at 6:00 AM PST (14:00 UTC)
    - cron: '0 14 * * *'
  workflow_dispatch: # Manual trigger

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Build with current date filtering
        run: pnpm build
        env:
          BUILD_DATE: ${{ github.event.schedule && 'scheduled' || 'manual' }}

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./out
          publish_branch: gh-pages
```

### Client-Side Fallback

```typescript
// components/post-guard.tsx
'use client';

import { useEffect, useState } from 'react';

interface PostGuardProps {
  publishedAt: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function PostGuard({ publishedAt, children, fallback }: PostGuardProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const publishDate = new Date(publishedAt);
    const now = new Date();
    setIsVisible(publishDate <= now);
  }, [publishedAt]);

  if (!isVisible) {
    return fallback || (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          This post will be available on {new Date(publishedAt).toLocaleDateString()}.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
```

---

## 6. Admin Dashboard

### Route Structure

```
/admin                      # Dashboard home
/admin/posts                # All posts management
/admin/linkedin             # LinkedIn management
/admin/linkedin/[id]        # Individual LinkedIn post
/admin/analytics            # Analytics dashboard
/admin/calendar             # Publication calendar view
/admin/research             # Final report management
```

### Authentication

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const adminToken = request.cookies.get('admin_token');

    if (!adminToken || adminToken.value !== process.env.ADMIN_TOKEN) {
      // Redirect to login or show 401
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
```

### Admin Login Page

```typescript
// app/admin/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simple password check (hash comparison in production)
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (response.ok) {
      router.push('/admin');
    } else {
      setError('Invalid password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleLogin} className="w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-center">Admin Access</h1>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter admin password"
          className="w-full p-3 border rounded"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          className="w-full p-3 bg-primary text-white rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
}
```

### Dashboard Home Component

```typescript
// app/admin/page.tsx
import { getAllPostsForAdmin, getUpcomingPosts } from '@/lib/posts';
import linkedinPosts from '@/data/linkedin-posts.json';
import calendar from '@/data/publication-calendar.json';

export default function AdminDashboard() {
  const allPosts = getAllPostsForAdmin();
  const upcomingPosts = getUpcomingPosts();
  const publishedCount = allPosts.length - upcomingPosts.length;

  const linkedinStats = {
    total: linkedinPosts.posts.length,
    posted: linkedinPosts.posts.filter(p => p.status === 'posted').length,
    scheduled: linkedinPosts.posts.filter(p => p.manuallyScheduled).length,
    pending: linkedinPosts.posts.filter(p => p.status === 'pending' && !p.manuallyScheduled).length,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">AI Agents Research - Admin Dashboard</h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Posts" value={allPosts.length} subtitle="Blog articles" />
        <StatCard title="Published" value={publishedCount} subtitle="Currently live" color="green" />
        <StatCard title="Scheduled" value={upcomingPosts.length} subtitle="Coming soon" color="blue" />
        <StatCard title="LinkedIn Posted" value={linkedinStats.posted} subtitle={`of ${linkedinStats.total}`} color="purple" />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <QuickActionCard
          title="Next Publication"
          date={upcomingPosts[0]?.publishedAt}
          postTitle={upcomingPosts[0]?.title}
          href={`/admin/posts/${upcomingPosts[0]?.slugAsParams}`}
        />
        <QuickActionCard
          title="Next LinkedIn Post"
          linkedinPost={linkedinPosts.posts.find(p => p.status === 'pending')}
          href="/admin/linkedin"
        />
        <QuickActionCard
          title="Analytics Summary"
          href="/admin/analytics"
        />
      </div>

      {/* Calendar Preview */}
      <div className="bg-card rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Publication Calendar</h2>
        <CalendarPreview schedule={calendar.schedule} />
      </div>

      {/* Recent Activity */}
      <div className="bg-card rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <ActivityFeed />
      </div>
    </div>
  );
}
```

### Posts Management Page

```typescript
// app/admin/posts/page.tsx
import { getAllPostsForAdmin } from '@/lib/posts';
import linkedinPosts from '@/data/linkedin-posts.json';

export default function AdminPostsPage() {
  const posts = getAllPostsForAdmin();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">All Publications</h1>

      {/* Filter/Sort Controls */}
      <div className="flex gap-4 mb-6">
        <select className="border rounded px-3 py-2">
          <option value="all">All Categories</option>
          <option value="anchor">Anchor</option>
          <option value="theme">Theme Deep Dives</option>
          <option value="emergent">Emergent Insights</option>
          <option value="practitioner">Practitioner</option>
          <option value="prototype">Prototype</option>
          <option value="conference">Conference</option>
          <option value="methodology">Methodology</option>
        </select>
        <select className="border rounded px-3 py-2">
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="scheduled">Scheduled</option>
        </select>
      </div>

      {/* Posts Table */}
      <div className="bg-card rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-left">Publish Date</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">LinkedIn</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post, index) => {
              const linkedinPost = linkedinPosts.posts.find(
                lp => lp.blogPostSlug === post.slugAsParams
              );
              const isPublished = new Date(post.publishedAt) <= new Date();

              return (
                <tr key={post._id} className="border-t">
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3">
                    <a href={`/admin/posts/${post.slugAsParams}`} className="hover:underline">
                      {post.title}
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    <CategoryBadge category={post.category} />
                  </td>
                  <td className="px-4 py-3">
                    {new Date(post.publishedAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge published={isPublished} />
                  </td>
                  <td className="px-4 py-3">
                    <LinkedInStatusBadge status={linkedinPost?.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <a href={`/blog/${post.slugAsParams}`} target="_blank" className="text-blue-500">
                        View
                      </a>
                      <a href={`/admin/linkedin/${linkedinPost?.id}`} className="text-purple-500">
                        LinkedIn
                      </a>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

---

## 7. LinkedIn Integration

### Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Admin Dashboard                          │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  LinkedIn Management Page                                │   │
│  │  ├── Post Preview                                        │   │
│  │  ├── Copy to Clipboard (Manual Mode)                     │   │
│  │  ├── "Already Scheduled in LinkedIn" Checkbox            │   │
│  │  ├── Auto-Post Button                                    │   │
│  │  └── Image Preview & Download                            │   │
│  └─────────────────────────────────────────────────────────┘   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Cloudflare Worker API                         │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  POST /api/linkedin/post                                 │   │
│  │  ├── Validate admin token                                │   │
│  │  ├── Check "manuallyScheduled" flag                      │   │
│  │  ├── Upload image to LinkedIn                            │   │
│  │  ├── Create post with image                              │   │
│  │  └── Return post URL                                     │   │
│  └─────────────────────────────────────────────────────────┘   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      LinkedIn API                               │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  OAuth 2.0 Endpoints:                                    │   │
│  │  ├── /oauth/v2/authorization                             │   │
│  │  ├── /oauth/v2/accessToken                               │   │
│  │                                                          │   │
│  │  Post Endpoints:                                         │   │
│  │  ├── /v2/assets (image upload)                           │   │
│  │  └── /v2/ugcPosts (create post)                          │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### LinkedIn Management Page

```typescript
// app/admin/linkedin/page.tsx
'use client';

import { useState, useEffect } from 'react';
import linkedinPosts from '@/data/linkedin-posts.json';

export default function LinkedInManagementPage() {
  const [posts, setPosts] = useState(linkedinPosts.posts);
  const [filter, setFilter] = useState('all');

  const filteredPosts = posts.filter(post => {
    if (filter === 'all') return true;
    if (filter === 'pending') return post.status === 'pending' && !post.manuallyScheduled;
    if (filter === 'scheduled') return post.manuallyScheduled;
    if (filter === 'posted') return post.status === 'posted';
    return true;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">LinkedIn Management</h1>
        <LinkedInConnectionStatus />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard title="Total" value={posts.length} />
        <StatCard title="Posted" value={posts.filter(p => p.status === 'posted').length} color="green" />
        <StatCard title="Scheduled" value={posts.filter(p => p.manuallyScheduled).length} color="blue" />
        <StatCard title="Pending" value={posts.filter(p => p.status === 'pending' && !p.manuallyScheduled).length} color="yellow" />
      </div>

      {/* Filter */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-primary text-white' : 'bg-muted'}`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 rounded ${filter === 'pending' ? 'bg-primary text-white' : 'bg-muted'}`}
        >
          Pending
        </button>
        <button
          onClick={() => setFilter('scheduled')}
          className={`px-4 py-2 rounded ${filter === 'scheduled' ? 'bg-primary text-white' : 'bg-muted'}`}
        >
          Manually Scheduled
        </button>
        <button
          onClick={() => setFilter('posted')}
          className={`px-4 py-2 rounded ${filter === 'posted' ? 'bg-primary text-white' : 'bg-muted'}`}
        >
          Posted
        </button>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map(post => (
          <LinkedInPostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
```

### Individual LinkedIn Post Page

```typescript
// app/admin/linkedin/[id]/page.tsx
'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import linkedinPosts from '@/data/linkedin-posts.json';

export default function LinkedInPostDetailPage() {
  const { id } = useParams();
  const post = linkedinPosts.posts.find(p => p.id === id);

  const [manuallyScheduled, setManuallyScheduled] = useState(post?.manuallyScheduled || false);
  const [isPosting, setIsPosting] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!post) {
    return <div>Post not found</div>;
  }

  const handleCopyContent = async () => {
    const fullContent = `${post.content}\n\n${post.hashtags.join(' ')}`;
    await navigator.clipboard.writeText(fullContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleScheduled = async () => {
    const newValue = !manuallyScheduled;
    setManuallyScheduled(newValue);

    // Update in storage/API
    await fetch('/api/admin/linkedin/update-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: post.id, manuallyScheduled: newValue }),
    });
  };

  const handleAutoPost = async () => {
    if (manuallyScheduled) {
      alert('This post is marked as already scheduled. Uncheck the box to auto-post.');
      return;
    }

    if (!confirm('Are you sure you want to post this to LinkedIn now?')) {
      return;
    }

    setIsPosting(true);

    try {
      const response = await fetch('/api/linkedin/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: post.id }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Successfully posted! View at: ${data.postUrl}`);
        // Refresh page or update state
      } else {
        throw new Error('Failed to post');
      }
    } catch (error) {
      alert('Failed to post to LinkedIn. Please try again.');
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <a href="/admin/linkedin" className="text-blue-500 hover:underline">
          ← Back to LinkedIn Management
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Content Preview */}
        <div className="space-y-6">
          <h1 className="text-2xl font-bold">Post #{post.seriesOrder}: {post.title}</h1>

          {/* Post Preview Card */}
          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
              <div>
                <div className="font-semibold">Fernando Torres</div>
                <div className="text-sm text-gray-500">MSx '26 @ Stanford GSB</div>
              </div>
            </div>
            <div className="whitespace-pre-wrap text-sm mb-4">
              {post.content}
            </div>
            <div className="text-blue-500 text-sm">
              {post.hashtags.join(' ')}
            </div>
          </div>

          {/* Copy Button */}
          <button
            onClick={handleCopyContent}
            className="w-full py-3 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition"
          >
            {copied ? '✓ Copied to Clipboard!' : 'Copy Content to Clipboard'}
          </button>
        </div>

        {/* Right: Controls & Image */}
        <div className="space-y-6">
          {/* Image Preview */}
          <div>
            <h3 className="font-semibold mb-2">Cover Image</h3>
            <img
              src={`/images/blog/${post.imageFile}`}
              alt={post.title}
              className="w-full rounded-lg border"
            />
            <a
              href={`/images/blog/${post.imageFile}`}
              download
              className="block text-center mt-2 text-blue-500 hover:underline"
            >
              Download Image
            </a>
          </div>

          {/* Schedule Info */}
          <div className="bg-muted rounded-lg p-4">
            <h3 className="font-semibold mb-2">Schedule</h3>
            <p>Date: {new Date(post.scheduledDate).toLocaleDateString()}</p>
            <p>Time: {post.scheduledTime} PST</p>
          </div>

          {/* Already Scheduled Checkbox */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={manuallyScheduled}
                onChange={handleToggleScheduled}
                className="mt-1 w-5 h-5"
              />
              <div>
                <div className="font-semibold text-yellow-800">
                  Already Scheduled in LinkedIn
                </div>
                <div className="text-sm text-yellow-700 mt-1">
                  Check this box if you've already scheduled this post manually in LinkedIn.
                  This will prevent the auto-post function from duplicating it.
                </div>
              </div>
            </label>
          </div>

          {/* Auto-Post Button */}
          <button
            onClick={handleAutoPost}
            disabled={isPosting || manuallyScheduled || post.status === 'posted'}
            className={`w-full py-4 rounded-lg font-semibold text-white transition ${
              manuallyScheduled || post.status === 'posted'
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isPosting ? 'Posting...' :
             post.status === 'posted' ? '✓ Already Posted' :
             manuallyScheduled ? 'Manually Scheduled (Auto-Post Disabled)' :
             'Post to LinkedIn Now'}
          </button>

          {/* Status */}
          <div className="text-center">
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
              post.status === 'posted' ? 'bg-green-100 text-green-800' :
              manuallyScheduled ? 'bg-blue-100 text-blue-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {post.status === 'posted' ? '✓ Posted' :
               manuallyScheduled ? '📅 Manually Scheduled' :
               '⏳ Pending'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### Cloudflare Worker - LinkedIn API

```typescript
// cloudflare-worker/src/linkedin.ts
export interface Env {
  LINKEDIN_CLIENT_ID: string;
  LINKEDIN_CLIENT_SECRET: string;
  LINKEDIN_ACCESS_TOKEN: string;
  LINKEDIN_PERSON_URN: string;
  ADMIN_TOKEN: string;
  KV_STORAGE: KVNamespace;
}

export async function handleLinkedInPost(
  request: Request,
  env: Env
): Promise<Response> {
  // Verify admin token
  const authHeader = request.headers.get('Authorization');
  if (authHeader !== `Bearer ${env.ADMIN_TOKEN}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const body = await request.json();
  const { postId, content, hashtags, imageUrl } = body;

  // Check if manually scheduled
  const postStatus = await env.KV_STORAGE.get(`linkedin:${postId}`);
  if (postStatus) {
    const status = JSON.parse(postStatus);
    if (status.manuallyScheduled) {
      return new Response(
        JSON.stringify({
          error: 'Post is marked as manually scheduled',
        }),
        { status: 400 }
      );
    }
  }

  try {
    // Step 1: Upload image (if provided)
    let imageAsset = null;
    if (imageUrl) {
      imageAsset = await uploadLinkedInImage(env, imageUrl);
    }

    // Step 2: Create post
    const postContent = {
      author: env.LINKEDIN_PERSON_URN,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text: `${content}\n\n${hashtags.join(' ')}`,
          },
          shareMediaCategory: imageAsset ? 'IMAGE' : 'NONE',
          media: imageAsset
            ? [
                {
                  status: 'READY',
                  media: imageAsset,
                },
              ]
            : [],
        },
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
      },
    };

    const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.LINKEDIN_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0',
      },
      body: JSON.stringify(postContent),
    });

    if (!response.ok) {
      throw new Error(`LinkedIn API error: ${response.status}`);
    }

    const result = await response.json();

    // Update status in KV
    await env.KV_STORAGE.put(
      `linkedin:${postId}`,
      JSON.stringify({
        status: 'posted',
        postedAt: new Date().toISOString(),
        linkedinPostId: result.id,
      })
    );

    return new Response(
      JSON.stringify({
        success: true,
        postUrl: `https://www.linkedin.com/feed/update/${result.id}`,
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
```

---

## 8. Analytics System

### Analytics Provider: Plausible Analytics

Self-hosted or cloud option for privacy-friendly analytics.

### Setup

```typescript
// app/layout.tsx
import Script from 'next/script';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Plausible Analytics */}
        <Script
          defer
          data-domain="fernandotorres.io"
          src="https://plausible.io/js/script.js"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### Custom Events Tracking

```typescript
// lib/analytics.ts
declare global {
  interface Window {
    plausible?: (
      event: string,
      options?: { props?: Record<string, string | number> }
    ) => void;
  }
}

export function trackEvent(
  event: string,
  props?: Record<string, string | number>
) {
  if (typeof window !== 'undefined' && window.plausible) {
    window.plausible(event, { props });
  }
}

// Track specific events
export const analytics = {
  blogPostView: (slug: string, category: string) =>
    trackEvent('Blog Post View', { slug, category }),

  linkedinClick: (postId: string) => trackEvent('LinkedIn Click', { postId }),

  researchDownload: () => trackEvent('Research PDF Download'),

  readComplete: (slug: string, readTime: number) =>
    trackEvent('Read Complete', { slug, readTime: Math.round(readTime) }),
};
```

### Analytics Dashboard Component

```typescript
// app/admin/analytics/page.tsx
'use client';

import { useState, useEffect } from 'react';

export default function AnalyticsDashboard() {
  const [period, setPeriod] = useState('30d');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics(period);
  }, [period]);

  const fetchAnalytics = async (period: string) => {
    setLoading(true);
    try {
      // Fetch from Plausible API via proxy
      const response = await fetch(`/api/analytics?period=${period}`);
      const data = await response.json();
      setData(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <div className="flex gap-2">
          {['7d', '30d', '12mo'].map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded ${
                period === p ? 'bg-primary text-white' : 'bg-muted'
              }`}
            >
              {p === '7d' ? '7 Days' : p === '30d' ? '30 Days' : '12 Months'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <>
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <AnalyticsCard
              title="Total Visitors"
              value={data?.visitors?.toLocaleString()}
              change={data?.visitorsChange}
            />
            <AnalyticsCard
              title="Page Views"
              value={data?.pageviews?.toLocaleString()}
              change={data?.pageviewsChange}
            />
            <AnalyticsCard
              title="Avg. Time on Site"
              value={formatDuration(data?.avgTime)}
            />
            <AnalyticsCard
              title="Bounce Rate"
              value={`${data?.bounceRate}%`}
            />
          </div>

          {/* Traffic Chart */}
          <div className="bg-card rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Traffic Over Time</h2>
            <TrafficChart data={data?.timeseries} />
          </div>

          {/* Top Pages */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-card rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Top Blog Posts</h2>
              <TopPagesTable pages={data?.topPages?.filter(p => p.page.includes('/blog/'))} />
            </div>
            <div className="bg-card rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Traffic Sources</h2>
              <ReferrersTable referrers={data?.referrers} />
            </div>
          </div>

          {/* AI Agents Research Specific */}
          <div className="bg-card rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">AI Agents Research Series Performance</h2>
            <ResearchSeriesAnalytics data={data?.researchPosts} />
          </div>
        </>
      )}
    </div>
  );
}
```

### Analytics API Proxy

```typescript
// cloudflare-worker/src/analytics.ts
export async function handleAnalytics(
  request: Request,
  env: Env
): Promise<Response> {
  const url = new URL(request.url);
  const period = url.searchParams.get('period') || '30d';

  // Fetch from Plausible Stats API
  const plausibleResponse = await fetch(
    `https://plausible.io/api/v1/stats/aggregate?site_id=fernandotorres.io&period=${period}&metrics=visitors,pageviews,bounce_rate,visit_duration`,
    {
      headers: {
        Authorization: `Bearer ${env.PLAUSIBLE_API_KEY}`,
      },
    }
  );

  const stats = await plausibleResponse.json();

  // Fetch timeseries
  const timeseriesResponse = await fetch(
    `https://plausible.io/api/v1/stats/timeseries?site_id=fernandotorres.io&period=${period}`,
    {
      headers: {
        Authorization: `Bearer ${env.PLAUSIBLE_API_KEY}`,
      },
    }
  );

  const timeseries = await timeseriesResponse.json();

  // Fetch top pages
  const pagesResponse = await fetch(
    `https://plausible.io/api/v1/stats/breakdown?site_id=fernandotorres.io&period=${period}&property=event:page&limit=20`,
    {
      headers: {
        Authorization: `Bearer ${env.PLAUSIBLE_API_KEY}`,
      },
    }
  );

  const pages = await pagesResponse.json();

  return new Response(
    JSON.stringify({
      visitors: stats.results.visitors.value,
      pageviews: stats.results.pageviews.value,
      bounceRate: stats.results.bounce_rate.value,
      avgTime: stats.results.visit_duration.value,
      timeseries: timeseries.results,
      topPages: pages.results,
    }),
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );
}
```

---

## 9. Final Report Showcase

### Page Structure

```typescript
// app/research/page.tsx
import { Metadata } from 'next';
import researchContent from '@/content/research/final-report.mdx';

export const metadata: Metadata = {
  title: "What's Needed to Unlock the Full Potential of AI Agents? | Stanford GSB Research",
  description: "Research spanning 36 expert interviews, 5 industry conferences, and 3 functional prototypes reveals that AI agent deployment is fundamentally an engineering problem, not an AI problem.",
  openGraph: {
    title: "AI Agents Research Report | Stanford GSB GSBGEN 390",
    description: "90% of enterprise AI agent pilots fail. Our research reveals why—and what it takes to succeed.",
    images: ['/images/research/og-image.png'],
  },
};

export default function ResearchPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-20">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <div className="mb-4 text-sm font-medium text-primary">
            Stanford GSB GSBGEN 390 | Autumn 2025
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            What's Needed to Unlock the Full Potential of AI Agents?
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Research spanning 36 expert interviews, 5 industry conferences,
            and 3 functional prototypes reveals the real blockers—and opportunities—
            in AI agent deployment.
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="#full-report"
              className="px-6 py-3 bg-primary text-white rounded-lg font-medium"
            >
              Read Full Report
            </a>
            <a
              href="/research/download"
              className="px-6 py-3 border border-primary text-primary rounded-lg font-medium"
            >
              Download PDF
            </a>
          </div>
        </div>
      </section>

      {/* Key Statistics */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-12">Key Findings</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <StatHighlight
              value="90%"
              label="Pilot Failure Rate"
              description="of enterprise AI agent pilots never reach production"
            />
            <StatHighlight
              value="30-40%"
              label="Model Contribution"
              description="Models contribute only 30-40% to agent success"
            />
            <StatHighlight
              value="80-90%"
              label="Framework Abandonment"
              description="of production teams abandon initial framework"
            />
            <StatHighlight
              value="92%"
              label="Integration Challenge"
              description="of sources cite system integration as #1 blocker"
            />
          </div>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <div className="sticky top-24">
                <h3 className="font-bold mb-4">Contents</h3>
                <TableOfContents />
              </div>
            </div>
            <div className="md:col-span-2">
              {/* Full Report Content */}
              <article id="full-report" className="prose prose-lg max-w-none">
                <researchContent />
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* Authors */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl font-bold text-center mb-8">Authors</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <AuthorCard
              name="Fernando Torres"
              role="MSx '26, Stanford GSB"
              image="/images/authors/fernando.jpg"
              linkedin="https://linkedin.com/in/fernandotn"
            />
            <AuthorCard
              name="Shekhar Bhende"
              role="MSx '26, Stanford GSB"
              image="/images/authors/shekhar.jpg"
              linkedin="https://linkedin.com/in/shekharbhende"
            />
          </div>
          <div className="text-center mt-8 text-muted-foreground">
            <p>Faculty Sponsor: Prof. Scott J. Brady</p>
          </div>
        </div>
      </section>

      {/* Related Publications */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl font-bold text-center mb-8">
            Explore the Publication Series
          </h2>
          <p className="text-center text-muted-foreground mb-8">
            25 deep-dive articles exploring specific findings from the research
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <SeriesCard
              title="Theme Deep Dives"
              count={6}
              description="System Integration, Context Management, Framework Ecosystem, and more"
              href="/blog?category=theme"
            />
            <SeriesCard
              title="Emergent Insights"
              count={6}
              description="The 30-40% Model Myth, Handoff Rate Metric, MCP Tool Cliff"
              href="/blog?category=emergent"
            />
            <SeriesCard
              title="Practitioner Perspectives"
              count={5}
              description="Interviews with an AI agent orchestration company, an AI infrastructure company, a major enterprise identity company, a multi-agent framework company, an AI sales intelligence company"
              href="/blog?category=practitioner"
            />
          </div>
          <div className="text-center mt-8">
            <a href="/blog" className="text-primary hover:underline">
              View All 25 Publications →
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
```

### Table of Contents Component

```typescript
// components/research/table-of-contents.tsx
'use client';

import { useEffect, useState } from 'react';

const sections = [
  { id: 'abstract', title: 'Abstract' },
  { id: 'section-a-starting-point', title: 'A: Starting Point', subsections: [
    { id: 'the-challenge', title: 'The Challenge' },
    { id: 'initial-hypotheses', title: 'Initial Hypotheses' },
    { id: 'research-methodology', title: 'Research Methodology' },
  ]},
  { id: 'section-b-learnings', title: 'B: Major Learnings', subsections: [
    { id: 'fundamental-insight', title: 'Fundamental Insight' },
    { id: 'pattern-1-system-integration', title: 'Pattern 1: System Integration' },
    { id: 'pattern-2-framework-abandonment', title: 'Pattern 2: Framework Abandonment' },
    { id: 'pattern-3-demo-threshold', title: 'Pattern 3: 70% Demo Threshold' },
  ]},
  { id: 'section-c-enterprise', title: 'C: Enterprise Blockers' },
  { id: 'section-d-opportunities', title: 'D: Opportunities' },
  { id: 'section-e-conclusion', title: 'E: Conclusion' },
];

export function TableOfContents() {
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -80% 0px' }
    );

    sections.forEach(section => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <nav className="space-y-2">
      {sections.map(section => (
        <div key={section.id}>
          <a
            href={`#${section.id}`}
            className={`block py-1 text-sm transition ${
              activeSection === section.id
                ? 'text-primary font-medium'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {section.title}
          </a>
          {section.subsections && (
            <div className="ml-4 space-y-1">
              {section.subsections.map(sub => (
                <a
                  key={sub.id}
                  href={`#${sub.id}`}
                  className={`block py-0.5 text-xs transition ${
                    activeSection === sub.id
                      ? 'text-primary font-medium'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {sub.title}
                </a>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}
```

---

## 10. Publication Calendar

### Calendar Starting December 8, 2025

| Week   | Dates          | Day | #   | Publication                                                                                   | Category     | LinkedIn  |
| ------ | -------------- | --- | --- | --------------------------------------------------------------------------------------------- | ------------ | --------- |
| **1**  | Dec 8-12       | Mon | 1   | What's Really Blocking AI Agents from Production?                                             | Anchor       | 09:00 PST |
|        |                | Wed | 2   | Why 92% of AI Agent Deployments Struggle with System Integration                              | Theme        | 09:00 PST |
|        |                | Fri | 3   | The 40% Rule: Why Larger Context Windows Won't Save Your AI Agent                             | Theme        | 09:00 PST |
| **2**  | Dec 15-19      | Tue | 4   | 80-90% of Teams Abandon a popular AI agent framework for Production                           | Theme        | 09:00 PST |
|        |                | Thu | 5   | The Demo-Production Chasm: Why 70% Accuracy Creates False Expectations                        | Theme        | 09:00 PST |
| **3**  | Dec 22-26      | Mon | 6   | Enterprise AI Agents: When Business Case Failure Precedes Technical Failure                   | Theme        | 09:00 PST |
|        |                | Wed | 7   | Why Coding Agents Are the Exception, Not the Rule                                             | Theme        | 09:00 PST |
|        |                | Fri | 8   | The 30-40% Model Myth: Why Framework Architecture Matters More                                | Emergent     | 09:00 PST |
| **4**  | Dec 29 - Jan 2 | Tue | 9   | Handoff Rate: The North Star Metric for AI Agent Success                                      | Emergent     | 09:00 PST |
|        |                | Thu | 10  | Dual Memory Architecture: The Distinction Most AI Companies Miss                              | Emergent     | 09:00 PST |
| **5**  | Jan 5-9        | Mon | 11  | MCP Reality Check: The 25-Tool Accuracy Cliff No One Talks About                              | Emergent     | 09:00 PST |
|        |                | Wed | 12  | Component-Level Evaluation: Why End-to-End Testing Fails for AI Agents                        | Emergent     | 09:00 PST |
|        |                | Fri | 13  | The Evaluation Gap: Why 7 YC Companies Building Eval Tools Have Zero Adoption                 | Emergent     | 09:00 PST |
| **6**  | Jan 12-16      | Tue | 14  | Inside an AI agent orchestration company: Why 90% of Enterprise AI Agent Pilots Never Convert | Practitioner | 09:00 PST |
|        |                | Thu | 15  | an AI infrastructure company's Take: Managing Expectations with Probabilistic Systems         | Practitioner | 09:00 PST |
| **7**  | Jan 19-23      | Mon | 16  | How a major enterprise identity company is Solving AI Agent Identity: The Next SSO Moment     | Practitioner | 09:00 PST |
|        |                | Wed | 17  | a multi-agent framework company's Lesson: Why Enterprise Topology Complexity Is Your Moat     | Practitioner | 09:00 PST |
|        |                | Fri | 18  | an AI sales intelligence company's Approach: Building AI Sales Agents That Actually Work      | Practitioner | 09:00 PST |
| **8**  | Jan 26-30      | Tue | 19  | Building a Shopping Agent: Framework Bloat in Action                                          | Prototype    | 09:00 PST |
|        |                | Thu | 20  | Repo Patcher: Using State Machines to Make AI Agents Reliable                                 | Prototype    | 09:00 PST |
| **9**  | Feb 2-6        | Mon | 21  | Good Agents: Implementing Plan-Verify-Execute for Multi-Agent Orchestration                   | Prototype    | 09:00 PST |
|        |                | Wed | 22  | an AI autonomous agent company Fireside: The 30-40% Model Revelation That Changed Everything  | Conference   | 09:00 PST |
|        |                | Fri | 23  | Why 95% of Agentic AI Projects Fail: Key Conference Takeaways                                 | Conference   | 09:00 PST |
| **10** | Feb 9-13       | Tue | 24  | Production Agents Summit: The 40% Context Rule and Other Uncomfortable Truths                 | Conference   | 09:00 PST |
|        |                | Thu | 25  | How We Processed 36 Interviews into One Research Report                                       | Methodology  | 09:00 PST |

### Calendar JSON

```json
// /data/publication-calendar.json
{
  "series": {
    "name": "AI Agents Research Publication Series",
    "startDate": "2025-12-08",
    "endDate": "2025-02-13",
    "totalWeeks": 10,
    "totalPosts": 25,
    "defaultPostTime": "09:00",
    "timezone": "America/Los_Angeles"
  },
  "weeks": [
    {
      "week": 1,
      "theme": "Launch Week",
      "dateRange": "Dec 8-12, 2025",
      "posts": [
        {
          "order": 1,
          "date": "2025-12-08",
          "day": "Monday",
          "slug": "ai-agents-research-overview",
          "title": "What's Really Blocking AI Agents from Production?",
          "category": "anchor",
          "linkedinTime": "09:00"
        },
        {
          "order": 2,
          "date": "2025-12-10",
          "day": "Wednesday",
          "slug": "system-integration-92-percent",
          "title": "Why 92% of AI Agent Deployments Struggle with System Integration",
          "category": "theme",
          "linkedinTime": "09:00"
        },
        {
          "order": 3,
          "date": "2025-12-12",
          "day": "Friday",
          "slug": "40-percent-context-rule",
          "title": "The 40% Rule: Why Larger Context Windows Won't Save Your AI Agent",
          "category": "theme",
          "linkedinTime": "09:00"
        }
      ]
    }
    // ... weeks 2-10 following the same structure
  ]
}
```

---

## 11. File Structure

### Complete Project Structure

```
FernandoTorresWebsite/
├── app/
│   ├── layout.tsx                      # Root layout with analytics
│   ├── page.tsx                        # Homepage
│   ├── globals.css
│   │
│   ├── blog/
│   │   ├── page.tsx                    # Blog listing (filtered by date)
│   │   └── [slug]/
│   │       └── page.tsx                # Individual blog post
│   │
│   ├── research/
│   │   ├── page.tsx                    # Final Report showcase
│   │   └── download/
│   │       └── route.ts                # PDF download handler
│   │
│   ├── admin/
│   │   ├── layout.tsx                  # Admin layout with auth check
│   │   ├── page.tsx                    # Dashboard home
│   │   ├── login/
│   │   │   └── page.tsx                # Admin login
│   │   ├── posts/
│   │   │   ├── page.tsx                # All posts management
│   │   │   └── [slug]/
│   │   │       └── page.tsx            # Individual post admin
│   │   ├── linkedin/
│   │   │   ├── page.tsx                # LinkedIn management
│   │   │   └── [id]/
│   │   │       └── page.tsx            # Individual LinkedIn post
│   │   ├── analytics/
│   │   │   └── page.tsx                # Analytics dashboard
│   │   └── calendar/
│   │       └── page.tsx                # Publication calendar
│   │
│   └── api/
│       ├── admin/
│       │   ├── login/
│       │   │   └── route.ts            # Admin login API
│       │   └── linkedin/
│       │       └── update-status/
│       │           └── route.ts        # Update LinkedIn status
│       └── newsletter/
│           └── route.ts                # Existing newsletter API
│
├── components/
│   ├── admin/
│   │   ├── stat-card.tsx
│   │   ├── calendar-preview.tsx
│   │   ├── activity-feed.tsx
│   │   ├── linkedin-post-card.tsx
│   │   ├── traffic-chart.tsx
│   │   └── analytics-card.tsx
│   ├── research/
│   │   ├── table-of-contents.tsx
│   │   ├── stat-highlight.tsx
│   │   ├── author-card.tsx
│   │   └── series-card.tsx
│   ├── blog/
│   │   ├── post-guard.tsx              # Client-side date check
│   │   ├── series-nav.tsx              # Navigate between series posts
│   │   └── category-badge.tsx
│   └── ui/
│       └── ... (existing components)
│
├── content/
│   ├── blog/
│   │   ├── 2025-12-ai-agents-research-overview.mdx
│   │   ├── 2025-12-system-integration-92-percent.mdx
│   │   └── ... (23 more posts)
│   └── research/
│       └── final-report.mdx            # Full Final Report as MDX
│
├── data/
│   ├── linkedin-posts.json             # All LinkedIn post content
│   └── publication-calendar.json       # Schedule data
│
├── lib/
│   ├── posts.ts                        # Post filtering utilities
│   ├── analytics.ts                    # Analytics tracking
│   └── validations.ts
│
├── public/
│   ├── images/
│   │   ├── blog/
│   │   │   ├── anchor/
│   │   │   │   └── anchor-cover.png
│   │   │   ├── theme-covers/
│   │   │   │   └── ... (6 images)
│   │   │   ├── infographics/
│   │   │   │   └── ... (4 images)
│   │   │   ├── technical-diagrams/
│   │   │   │   └── ... (6 images)
│   │   │   ├── emergent-insights/
│   │   │   │   └── ... (6 images)
│   │   │   ├── practitioner-interviews/
│   │   │   │   └── ... (5 images)
│   │   │   └── prototype-conference/
│   │   │       └── ... (7 images)
│   │   └── research/
│   │       └── og-image.png
│   └── downloads/
│       └── ai-agents-research-final-report.pdf
│
├── .github/
│   └── workflows/
│       ├── deploy.yml                  # Standard deploy on push
│       └── scheduled-deploy.yml        # Daily scheduled rebuild
│
├── cloudflare-worker/                  # Separate Cloudflare Worker project
│   ├── src/
│   │   ├── index.ts                    # Worker entry point
│   │   ├── linkedin.ts                 # LinkedIn API handlers
│   │   └── analytics.ts                # Analytics proxy
│   ├── wrangler.toml
│   └── package.json
│
├── contentlayer.config.js              # Updated with new fields
├── middleware.ts                       # Admin route protection
├── next.config.js
├── package.json
└── tailwind.config.js
```

---

## 12. Data Models

### TypeScript Interfaces

```typescript
// types/index.ts

// Blog Post (from Contentlayer)
export interface BlogPost {
  _id: string;
  title: string;
  summary: string;
  publishedAt: string;
  tags: string[];
  image?: string;
  author: string;
  featured: boolean;
  seriesOrder?: number;
  category?:
    | 'anchor'
    | 'theme'
    | 'emergent'
    | 'practitioner'
    | 'prototype'
    | 'conference'
    | 'methodology';
  linkedinPostId?: string;
  linkedinScheduled?: boolean;
  linkedinPosted?: boolean;
  linkedinPostedAt?: string;
  requiresPermission?: boolean;
  permissionGranted?: boolean;
  body: { raw: string; code: string };
  slug: string;
  slugAsParams: string;
  readingTime: { text: string; minutes: number; time: number; words: number };
  isPublished: boolean;
  daysUntilPublish: number;
}

// LinkedIn Post
export interface LinkedInPost {
  id: string;
  blogPostSlug: string;
  seriesOrder: number;
  title: string;
  content: string;
  hashtags: string[];
  scheduledDate: string;
  scheduledTime: string;
  timezone: string;
  imageFile: string;
  status: 'pending' | 'scheduled' | 'posted' | 'failed';
  manuallyScheduled: boolean;
  linkedinPostUrl: string | null;
  postedAt: string | null;
  error?: string;
}

// Publication Calendar
export interface PublicationCalendar {
  series: {
    name: string;
    startDate: string;
    endDate: string;
    totalWeeks: number;
    totalPosts: number;
    defaultPostTime: string;
    timezone: string;
  };
  weeks: CalendarWeek[];
}

export interface CalendarWeek {
  week: number;
  theme: string;
  dateRange: string;
  posts: CalendarPost[];
}

export interface CalendarPost {
  order: number;
  date: string;
  day: string;
  slug: string;
  title: string;
  category: string;
  linkedinTime: string;
}

// Analytics
export interface AnalyticsData {
  visitors: number;
  visitorsChange?: number;
  pageviews: number;
  pageviewsChange?: number;
  bounceRate: number;
  avgTime: number;
  timeseries: TimeseriesPoint[];
  topPages: PageStats[];
  referrers: ReferrerStats[];
}

export interface TimeseriesPoint {
  date: string;
  visitors: number;
  pageviews: number;
}

export interface PageStats {
  page: string;
  visitors: number;
  pageviews: number;
}

export interface ReferrerStats {
  source: string;
  visitors: number;
}

// Admin State
export interface AdminState {
  linkedinConnected: boolean;
  linkedinTokenExpiry?: string;
  lastSync?: string;
}
```

---

## 13. API Specifications

### Admin Login API

```typescript
// app/api/admin/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  const { password } = await request.json();

  // Compare with hashed password in production
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }

  // Set secure cookie
  cookies().set('admin_token', process.env.ADMIN_TOKEN!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  });

  return NextResponse.json({ success: true });
}
```

### LinkedIn Status Update API

```typescript
// app/api/admin/linkedin/update-status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  const { id, manuallyScheduled, status } = await request.json();

  // Read current data
  const dataPath = path.join(process.cwd(), 'data', 'linkedin-posts.json');
  const data = JSON.parse(await fs.readFile(dataPath, 'utf-8'));

  // Update the specific post
  const postIndex = data.posts.findIndex((p: any) => p.id === id);
  if (postIndex === -1) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  if (manuallyScheduled !== undefined) {
    data.posts[postIndex].manuallyScheduled = manuallyScheduled;
  }
  if (status !== undefined) {
    data.posts[postIndex].status = status;
  }

  // Write back
  await fs.writeFile(dataPath, JSON.stringify(data, null, 2));

  return NextResponse.json({ success: true, post: data.posts[postIndex] });
}
```

### Cloudflare Worker Routes

```typescript
// cloudflare-worker/src/index.ts
import { handleLinkedInPost, handleLinkedInAuth } from './linkedin';
import { handleAnalytics } from './analytics';

export interface Env {
  LINKEDIN_CLIENT_ID: string;
  LINKEDIN_CLIENT_SECRET: string;
  LINKEDIN_ACCESS_TOKEN: string;
  LINKEDIN_PERSON_URN: string;
  PLAUSIBLE_API_KEY: string;
  ADMIN_TOKEN: string;
  KV_STORAGE: KVNamespace;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': 'https://fernandotorres.io',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    let response: Response;

    try {
      switch (url.pathname) {
        case '/api/linkedin/auth':
          response = await handleLinkedInAuth(request, env);
          break;
        case '/api/linkedin/post':
          response = await handleLinkedInPost(request, env);
          break;
        case '/api/analytics':
          response = await handleAnalytics(request, env);
          break;
        default:
          response = new Response('Not Found', { status: 404 });
      }
    } catch (error) {
      response = new Response(
        JSON.stringify({ error: 'Internal Server Error' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Add CORS headers to response
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  },
};
```

---

## 14. Implementation Phases

### Phase 1: Content Setup (Week 1)

**Duration:** 3-4 days

- [ ] Copy 25 blog posts to `/content/blog/`
- [ ] Update blog post frontmatter with new fields (seriesOrder, category, etc.)
- [ ] Copy 35 images to `/public/images/blog/`
- [ ] Create `/data/linkedin-posts.json`
- [ ] Create `/data/publication-calendar.json`
- [ ] Update `contentlayer.config.js` with new schema
- [ ] Convert Final Report to MDX format

### Phase 2: Core Website Features (Week 1-2)

**Duration:** 4-5 days

- [ ] Implement date-based filtering in blog listing
- [ ] Create `/research` page with Final Report
- [ ] Add series navigation between posts
- [ ] Implement category filtering
- [ ] Add "Read next" recommendations
- [ ] Set up GitHub Actions scheduled rebuild

### Phase 3: Admin Dashboard (Week 2-3)

**Duration:** 5-6 days

- [ ] Create admin route structure
- [ ] Implement authentication middleware
- [ ] Build dashboard home page
- [ ] Build posts management page
- [ ] Build publication calendar view
- [ ] Create LinkedIn management interface (manual mode)

### Phase 4: LinkedIn Integration (Week 3-4)

**Duration:** 4-5 days

- [ ] Set up Cloudflare Worker project
- [ ] Implement LinkedIn OAuth flow
- [ ] Build auto-post functionality
- [ ] Add "Already Scheduled" checkbox
- [ ] Test posting with images
- [ ] Deploy Worker to Cloudflare

### Phase 5: Analytics Integration (Week 4)

**Duration:** 2-3 days

- [ ] Set up Plausible Analytics account
- [ ] Add tracking script to layout
- [ ] Implement custom event tracking
- [ ] Build analytics dashboard in admin
- [ ] Create analytics API proxy in Worker

### Phase 6: Testing & Polish (Week 5)

**Duration:** 3-4 days

- [ ] Test auto-reveal functionality
- [ ] Test LinkedIn posting flow
- [ ] Test admin authentication
- [ ] Mobile responsiveness review
- [ ] SEO verification
- [ ] Performance optimization
- [ ] Documentation

### Phase 7: Launch (Week 5)

**Duration:** 1-2 days

- [ ] Final deployment to GitHub Pages
- [ ] Verify all posts scheduled correctly
- [ ] Monitor first day of publication
- [ ] Respond to any issues

---

## 15. Deployment & CI/CD

### Standard Deployment (on push)

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Build
        run: pnpm build
        env:
          ADMIN_TOKEN: ${{ secrets.ADMIN_TOKEN }}

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v2
        with:
          path: ./out

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v3
```

### Scheduled Deployment (daily)

```yaml
# .github/workflows/scheduled-deploy.yml
name: Scheduled Deploy (Auto-Reveal)

on:
  schedule:
    # Run daily at 6:00 AM PST (14:00 UTC)
    - cron: '0 14 * * *'
  workflow_dispatch:

jobs:
  check-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Check for posts to reveal
        id: check
        run: |
          # Check if any posts should become visible today
          TODAY=$(date -u +%Y-%m-%d)
          POSTS_TODAY=$(grep -l "publishedAt: '$TODAY'" content/blog/*.mdx || echo "")
          if [ -n "$POSTS_TODAY" ]; then
            echo "has_new_posts=true" >> $GITHUB_OUTPUT
            echo "Posts to reveal: $POSTS_TODAY"
          else
            echo "has_new_posts=false" >> $GITHUB_OUTPUT
            echo "No new posts to reveal today"
          fi

      - name: Trigger deploy if new posts
        if: steps.check.outputs.has_new_posts == 'true'
        uses: benc-uk/workflow-dispatch@v1
        with:
          workflow: deploy.yml
```

### Cloudflare Worker Deployment

```toml
# cloudflare-worker/wrangler.toml
name = "fernandotorres-api"
main = "src/index.ts"
compatibility_date = "2024-01-01"

[vars]
LINKEDIN_PERSON_URN = "urn:li:person:XXXXX"

[[kv_namespaces]]
binding = "KV_STORAGE"
id = "xxxxx"

[env.production]
vars = { ENVIRONMENT = "production" }

# Secrets set via wrangler CLI:
# wrangler secret put LINKEDIN_CLIENT_ID
# wrangler secret put LINKEDIN_CLIENT_SECRET
# wrangler secret put LINKEDIN_ACCESS_TOKEN
# wrangler secret put PLAUSIBLE_API_KEY
# wrangler secret put ADMIN_TOKEN
```

---

## 16. Security Considerations

### Secrets Management

| Secret                   | Storage Location   | Purpose                  |
| ------------------------ | ------------------ | ------------------------ |
| `ADMIN_PASSWORD`         | GitHub Secrets     | Admin login verification |
| `ADMIN_TOKEN`            | GitHub Secrets     | Session cookie value     |
| `LINKEDIN_CLIENT_ID`     | Cloudflare Secrets | LinkedIn OAuth           |
| `LINKEDIN_CLIENT_SECRET` | Cloudflare Secrets | LinkedIn OAuth           |
| `LINKEDIN_ACCESS_TOKEN`  | Cloudflare KV      | LinkedIn API access      |
| `PLAUSIBLE_API_KEY`      | Cloudflare Secrets | Analytics API            |

### Security Checklist

- [ ] Admin routes protected by middleware
- [ ] HTTPS enforced on all endpoints
- [ ] CORS restricted to `fernandotorres.io`
- [ ] httpOnly cookies for admin session
- [ ] API keys never exposed to client
- [ ] Rate limiting on Cloudflare Worker
- [ ] Input validation on all API endpoints
- [ ] LinkedIn tokens stored encrypted in KV

### Admin Route Protection

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Skip for login page
  if (request.nextUrl.pathname === '/admin/login') {
    return NextResponse.next();
  }

  // Check admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const adminToken = request.cookies.get('admin_token');

    if (!adminToken || adminToken.value !== process.env.ADMIN_TOKEN) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
```

---

## Appendix A: Environment Variables

### Local Development (`.env.local`)

```env
# Admin
ADMIN_PASSWORD=your-secure-password
ADMIN_TOKEN=your-random-token-string

# Analytics (optional for local)
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=fernandotorres.io

# API URL
NEXT_PUBLIC_API_URL=http://localhost:8787
```

### Production (GitHub Secrets)

```
ADMIN_PASSWORD
ADMIN_TOKEN
```

### Cloudflare Worker (Secrets)

```
LINKEDIN_CLIENT_ID
LINKEDIN_CLIENT_SECRET
LINKEDIN_ACCESS_TOKEN
LINKEDIN_PERSON_URN
PLAUSIBLE_API_KEY
ADMIN_TOKEN
```

---

## Appendix B: LinkedIn App Setup

### LinkedIn Developer Application

1. Go to [LinkedIn Developer Portal](https://developer.linkedin.com/)
2. Create new application
3. Request OAuth 2.0 scopes:
   - `w_member_social` (post on behalf of member)
   - `r_liteprofile` (read basic profile)
4. Set OAuth 2.0 redirect URL: `https://api.fernandotorres.io/api/linkedin/callback`
5. Note Client ID and Client Secret

### OAuth Flow

1. User clicks "Connect LinkedIn" in admin
2. Redirect to LinkedIn authorization
3. User grants permission
4. LinkedIn redirects back with auth code
5. Worker exchanges code for access token
6. Token stored in Cloudflare KV

---

## Appendix C: Content Checklist

### Before First Publication (Dec 8, 2025)

- [ ] All 25 blog posts in `/content/blog/` with correct `publishedAt` dates
- [ ] All 35 images in `/public/images/blog/` organized by category
- [ ] Final Report converted to MDX in `/content/research/`
- [ ] PDF version of Final Report in `/public/downloads/`
- [ ] LinkedIn posts JSON complete in `/data/`
- [ ] Publication calendar JSON complete in `/data/`
- [ ] Admin dashboard accessible and tested
- [ ] LinkedIn OAuth connected and tested
- [ ] Analytics tracking verified
- [ ] Scheduled GitHub Action enabled

---

**Document Status:** COMPLETE
**Ready for Implementation:** YES
**Estimated Implementation Time:** 5 weeks

---

_This specification document serves as the single source of truth for implementing the AI Agents Research publication series on fernandotorres.io. All implementation decisions should reference this document._
